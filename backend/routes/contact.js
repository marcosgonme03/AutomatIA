const express    = require('express');
const router     = express.Router();
const nodemailer = require('nodemailer');
const { stores } = require('../database');

const SERVICE_LABELS = {
  chatbot:'Chatbot con IA', 'sales-agent':'Agente de Ventas con IA',
  'voice-assistant':'Asistente de Voz con IA', email:'Email & Marketing',
  documents:'Generación de Documentos', analytics:'Análisis e Informes',
  integrations:'Integración de Sistemas', processes:'Automatización Interna',
  onboarding:'Automatización de Onboarding', payments:'Automatización de Cobros',
  content:'Generación de Contenido IA', workshop:'Formación IA para Equipos',
  maintenance:'Plan de Mantenimiento', audit:'Auditoría Gratuita',
  other:'Otro / No sé todavía',
};
const EMP_LABELS = {
  '1-5':'1 – 5 empleados','6-20':'6 – 20 empleados','21-50':'21 – 50 empleados',
  '51-100':'51 – 100 empleados','100+':'Más de 100',
};

router.post('/', (req, res) => {
  const { name, email, phone='', company='', employees='', service='', message='', preferred_date='', preferred_time='', website='' } = req.body;

  // Honeypot anti-spam: if this hidden field has a value, it's a bot
  if (website) return res.json({ ok: true, id: 0 });

  if (!name || !email) return res.status(400).json({ error: 'Nombre y email son obligatorios.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email no válido.' });

  const lead = stores.leads.insert({ name, email, phone, company, employees, service, message, preferred_date, preferred_time, status: 'nuevo', notes: '' });

  sendEmails({ name, email, phone, company, employees, service, message, preferred_date, preferred_time })
    .catch(err => console.error('Email error:', err.message));

  res.json({ ok: true, id: lead.id });
});

async function sendEmails(d) {
  if (!process.env.GMAIL_USER) {
    console.log('⚠️  Email no configurado — configura GMAIL_USER en .env');
    return;
  }
  if (!process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD.includes('xxxx')) {
    console.log('⚠️  Email no configurado — configura GMAIL_APP_PASSWORD en .env con una App Password real de Google.');
    console.log('   Cómo obtenerla: https://support.google.com/accounts/answer/185833');
    return;
  }
  const transport = nodemailer.createTransport({ service:'gmail', auth:{ user:process.env.GMAIL_USER, pass:process.env.GMAIL_APP_PASSWORD } });
  const svc = SERVICE_LABELS[d.service] || d.service || 'No especificado';
  const emp = EMP_LABELS[d.employees]   || d.employees || 'No especificado';

  const row = (label, val) => `<tr><td style="padding:8px 0;color:#94a3b8;font-size:14px;width:130px;vertical-align:top">${label}</td><td style="padding:8px 0;font-weight:600">${val}</td></tr>`;

  const adminHtml = `<!DOCTYPE html><html><body style="margin:0;background:#020617;font-family:Inter,sans-serif;color:#f8fafc">
  <div style="max-width:600px;margin:40px auto;background:#0a0f1e;border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#7c3aed,#06b6d4);padding:28px 36px"><h1 style="margin:0;font-size:22px">🔔 Nuevo Lead — AutomatIA Pro</h1><p style="margin:6px 0 0;opacity:.8;font-size:13px">${new Date().toLocaleString('es-ES')}</p></div>
    <div style="padding:36px"><table style="width:100%;border-collapse:collapse">${row('Nombre',d.name)}${row('Email',`<a href="mailto:${d.email}" style="color:#a855f7">${d.email}</a>`)}${row('Teléfono',d.phone||'—')}${row('Empresa',d.company||'—')}${row('Empleados',emp)}${row('Servicio',svc)}${row('Fecha pref.',d.preferred_date||'—')}${row('Hora pref.',d.preferred_time||'—')}</table>
    ${d.message?`<div style="margin-top:20px;padding:16px;background:rgba(255,255,255,.04);border-radius:10px;border-left:3px solid #7c3aed"><p style="margin:0 0 6px;font-size:12px;color:#94a3b8;font-weight:700">MENSAJE</p><p style="margin:0;font-size:14px">${d.message}</p></div>`:''}
    <div style="margin-top:28px;text-align:center"><a href="mailto:${d.email}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;padding:12px 24px;border-radius:50px;text-decoration:none;font-weight:700">Responder a ${d.name} →</a></div></div>
  </div></body></html>`;

  const confirmHtml = `<!DOCTYPE html><html><body style="margin:0;background:#020617;font-family:Inter,sans-serif;color:#f8fafc">
  <div style="max-width:600px;margin:40px auto;background:#0a0f1e;border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#7c3aed,#06b6d4);padding:32px 36px;text-align:center"><h1 style="margin:0;font-size:26px">¡Recibido, ${d.name.split(' ')[0]}! 🚀</h1></div>
    <div style="padding:36px;text-align:center">
      <p style="font-size:15px;color:#94a3b8;line-height:1.7">He recibido tu solicitud y te contactaré en menos de <strong style="color:#f8fafc">24 horas</strong> para confirmar tu consulta gratuita.</p>
      ${d.preferred_date?`<div style="margin:24px 0;padding:18px;background:rgba(124,58,237,.1);border-radius:12px;border:1px solid rgba(124,58,237,.3)"><p style="margin:0;font-size:12px;color:#a855f7;font-weight:700">CITA SOLICITADA</p><p style="margin:8px 0 0;font-size:17px;font-weight:600">${d.preferred_date}${d.preferred_time?' a las '+d.preferred_time:''}</p></div>`:''}
      <p style="font-size:13px;color:#64748b;margin-top:24px">AutomatIA Pro · marcosgonme03@gmail.com</p>
    </div>
  </div></body></html>`;

  await Promise.all([
    transport.sendMail({ from:`"AutomatIA Pro" <${process.env.GMAIL_USER}>`, to:process.env.GMAIL_USER, subject:`🔔 Nuevo lead: ${d.name} (${svc})`, html:adminHtml }),
    transport.sendMail({ from:`"AutomatIA Pro" <${process.env.GMAIL_USER}>`, to:d.email, subject:'¡He recibido tu solicitud! — AutomatIA Pro', html:confirmHtml }),
  ]);
}

module.exports = router;
