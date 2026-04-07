const express    = require('express');
const router     = express.Router();
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const { stores } = require('../database');
const auth       = require('../middleware/auth');

const SECRET = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'cambia_esto_por_algo_muy_secreto_y_largo_2025') {
    throw new Error('❌ JWT_SECRET no está configurado en .env. Usa una cadena aleatoria larga y segura.');
  }
  return secret;
};

// ── AUTH ──────────────────────────────────────────────

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Campos requeridos.' });
  const admin = stores.admin.get({ username });
  if (!admin || !bcrypt.compareSync(password, admin.password_hash))
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET(), { expiresIn: '7d' });
  res.json({ token, username: admin.username });
});

router.get('/me', auth, (req, res) => res.json({ username: req.admin.username }));

router.post('/change-password', auth, (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password || new_password.length < 8)
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres.' });
  if (current_password === new_password)
    return res.status(400).json({ error: 'La nueva contraseña debe ser diferente a la actual.' });
  const admin = stores.admin.getById(req.admin.id);
  if (!admin || !bcrypt.compareSync(current_password, admin.password_hash))
    return res.status(401).json({ error: 'Contraseña actual incorrecta.' });
  stores.admin.update(admin.id, { password_hash: bcrypt.hashSync(new_password, 10) });
  res.json({ ok: true, message: 'Contraseña actualizada correctamente.' });
});

// ── STATS ─────────────────────────────────────────────

router.get('/stats', auth, (req, res) => {
  const allLeads = stores.leads.data();
  const now      = new Date();
  const todayStr = now.toDateString();
  const weekAgo  = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const total  = allLeads.length;
  const today  = allLeads.filter(l => new Date(l.created_at).toDateString() === todayStr).length;
  const week   = allLeads.filter(l => new Date(l.created_at) >= weekAgo).length;

  const statusMap = {};
  allLeads.forEach(l => { statusMap[l.status] = (statusMap[l.status] || 0) + 1; });
  const byStatus = Object.entries(statusMap).map(([status, c]) => ({ status, c }));

  const serviceMap = {};
  allLeads.forEach(l => { if (l.service) serviceMap[l.service] = (serviceMap[l.service] || 0) + 1; });
  const byService = Object.entries(serviceMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([service, c]) => ({ service, c }));

  const recent = [...allLeads]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const active = (statusMap['nuevo'] || 0) + (statusMap['contactado'] || 0);
  const top_services = byService.map(s => ({ service: s.service, count: s.c }));

  res.json({ total, today, week, active, byStatus, byService, top_services, recent });
});

// ── LEADS ─────────────────────────────────────────────

router.get('/leads', auth, (req, res) => {
  const { status, service, search, page = 1, limit = 20 } = req.query;
  const lim = parseInt(limit), pg = parseInt(page);

  let leads = [...stores.leads.data()];
  if (status)  leads = leads.filter(l => l.status  === status);
  if (service) leads = leads.filter(l => l.service === service);
  if (search) {
    const s = search.toLowerCase();
    leads = leads.filter(l => [l.name, l.email, l.company].some(f => f && f.toLowerCase().includes(s)));
  }
  leads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const total  = leads.length;
  const pages  = Math.max(1, Math.ceil(total / lim));
  const offset = (pg - 1) * lim;
  res.json({ leads: leads.slice(offset, offset + lim), total, page: pg, pages });
});

router.get('/leads/export', auth, (req, res) => {
  const leads = [...stores.leads.data()].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const headers = ['ID','Nombre','Email','Teléfono','Empresa','Empleados','Servicio','Fecha pref.','Hora pref.','Estado','Notas','Fecha registro'];
  const rows = leads.map(l =>
    [l.id, l.name, l.email, l.phone, l.company, l.employees, l.service, l.preferred_date, l.preferred_time, l.status, l.notes, l.created_at]
      .map(v => `"${String(v || '').replace(/"/g, '""')}"`)
      .join(',')
  );
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="leads_${Date.now()}.csv"`);
  res.send('\uFEFF' + [headers.join(','), ...rows].join('\n'));
});

router.get('/leads/:id', auth, (req, res) => {
  const lead = stores.leads.getById(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado.' });
  res.json(lead);
});

router.patch('/leads/:id', auth, (req, res) => {
  const { status, notes } = req.body;
  const updates = {};
  if (status !== undefined) updates.status = status;
  if (notes  !== undefined) updates.notes  = notes;
  if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nada que actualizar.' });
  stores.leads.update(req.params.id, updates);
  res.json({ ok: true });
});

router.delete('/leads/:id', auth, (req, res) => {
  stores.leads.delete(req.params.id);
  res.json({ ok: true });
});

// ── TESTIMONIALS ──────────────────────────────────────

router.get('/testimonials', auth, (req, res) => {
  const rows = [...stores.testimonials.data()]
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || a.id - b.id);
  res.json(rows);
});

router.post('/testimonials', auth, (req, res) => {
  const { name, role='', company='', content, stars=5, initials, color='purple', published=1 } = req.body;
  if (!name || !content) return res.status(400).json({ error: 'Nombre y testimonio son requeridos.' });
  const auto_initials = initials || name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const maxOrder = Math.max(0, ...stores.testimonials.data().map(t => t.sort_order || 0));
  const t = stores.testimonials.insert({ name, role, company, content, stars: parseInt(stars), initials: auto_initials, color, published: published ? 1 : 0, sort_order: maxOrder + 1 });
  res.json({ ok: true, id: t.id });
});

router.get('/testimonials/:id', auth, (req, res) => {
  const t = stores.testimonials.getById(req.params.id);
  if (!t) return res.status(404).json({ error: 'Testimonio no encontrado.' });
  res.json(t);
});

router.patch('/testimonials/:id', auth, (req, res) => {
  const { name, role, company, content, stars, initials, color, published } = req.body;
  const updates = {};
  if (name      !== undefined) updates.name      = name;
  if (role      !== undefined) updates.role      = role;
  if (company   !== undefined) updates.company   = company;
  if (content   !== undefined) updates.content   = content;
  if (stars     !== undefined) updates.stars     = parseInt(stars);
  if (initials  !== undefined) updates.initials  = initials;
  if (color     !== undefined) updates.color     = color;
  if (published !== undefined) updates.published = published ? 1 : 0;
  if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nada que actualizar.' });
  stores.testimonials.update(req.params.id, updates);
  res.json({ ok: true });
});

router.delete('/testimonials/:id', auth, (req, res) => {
  stores.testimonials.delete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
