const fs   = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

// ── Simple JSON file store (no native compilation needed) ──
class Store {
  constructor(name) {
    this.file = path.join(DATA_DIR, `${name}.json`);
    this._data = [];
    this._nextId = 1;
    this._load();
  }

  _load() {
    if (fs.existsSync(this.file)) {
      try {
        this._data = JSON.parse(fs.readFileSync(this.file, 'utf8'));
        this._nextId = Math.max(0, ...this._data.map(r => r.id || 0)) + 1;
      } catch { this._data = []; }
    }
  }

  _save() {
    fs.writeFileSync(this.file, JSON.stringify(this._data, null, 2));
  }

  insert(record) {
    const row = { id: this._nextId++, created_at: new Date().toISOString(), ...record };
    this._data.push(row);
    this._save();
    return row;
  }

  all(filter = {}) {
    return this._data.filter(r =>
      Object.entries(filter).every(([k, v]) => r[k] === v)
    );
  }

  get(filter = {}) { return this.all(filter)[0] || null; }
  getById(id)      { return this._data.find(r => r.id == id) || null; }
  count(filter = {}) { return this.all(filter).length; }
  data()           { return this._data; }

  update(id, updates) {
    const idx = this._data.findIndex(r => r.id == id);
    if (idx >= 0) { Object.assign(this._data[idx], updates); this._save(); }
  }

  delete(id) {
    this._data = this._data.filter(r => r.id != id);
    this._save();
  }
}

const stores = {
  leads:        new Store('leads'),
  testimonials: new Store('testimonials'),
  admin:        new Store('admin'),
};

function initDB() {
  // Seed admin
  if (stores.admin.count() === 0) {
    const user = process.env.ADMIN_USER     || 'admin';
    const pass = process.env.ADMIN_PASSWORD || 'AutomatIA2025!';
    stores.admin.insert({ username: user, password_hash: bcrypt.hashSync(pass, 10), email_notifications: 1 });
    console.log(`🔐 Admin creado: usuario="${user}"`);
    console.log(`   Cambia la contraseña en el panel de control al iniciar sesión.`);
  }

  // Seed testimonials
  if (stores.testimonials.count() === 0) {
    [
      { name:'María Castro',   role:'CEO',               company:'Tienda online de moda', content:'Ahorramos 15 horas semanales en gestión de pedidos. El chatbot atiende a nuestros clientes mejor que algunos empleados y nunca descansa. Increíble ROI en solo 2 meses.', stars:5, initials:'MC', color:'purple', published:1, sort_order:1 },
      { name:'Javier Romero',  role:'Director Comercial', company:'Consultoría B2B',       content:'Integraron nuestro CRM con la facturación y el email en una semana. Lo que antes nos llevaba 3 horas al día ahora es automático. El equipo puede centrarse en vender.',    stars:5, initials:'JR', color:'cyan',   published:1, sort_order:2 },
      { name:'Laura Méndez',   role:'COO',               company:'Clínica dental',         content:'Los informes que generábamos manualmente cada semana ahora se hacen solos. Tenemos datos en tiempo real y hemos mejorado la toma de decisiones enormemente.',             stars:5, initials:'LM', color:'green',  published:1, sort_order:3 },
      { name:'Roberto Sánchez',role:'Gerente',           company:'Agencia de marketing',   content:'El sistema de automatización de emails multiplicó por 3 nuestra tasa de conversión. En 6 semanas recuperamos toda la inversión. Totalmente recomendable.',                stars:5, initials:'RS', color:'orange', published:1, sort_order:4 },
    ].forEach(t => stores.testimonials.insert(t));
  }
}

module.exports = { stores, initDB };
