const fs = require('fs');
const path = require('path');

// ── Debug log to file (stderr.log can be unreliable in Passenger) ──
const LOG_FILE = path.join(__dirname, 'app-debug.log');
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_FILE, line);
  console.log(msg);
}

log('=== APP.JS STARTING ===');
log('__dirname: ' + __dirname);
log('NODE_ENV: ' + process.env.NODE_ENV);
log('PORT env: ' + process.env.PORT);

try {
  // ── Load env ──
  require('dotenv').config({ path: path.join(__dirname, '.env') });
  log('.env loaded OK');

  const express = require('express');
  const rateLimit = require('express-rate-limit');
  const { initDB } = require('./backend/database');

  log('Modules loaded OK');

  const app = express();
  const PORT = process.env.PORT || 3000;

  // Init database
  initDB();
  log('DB initialized OK');

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'frontend')));

  // Rate limiting
  const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
  const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Demasiados envíos. Inténtalo en una hora.' }
  });

  app.use('/api/', apiLimiter);

  // Routes
  app.use('/api/contact', contactLimiter, require('./backend/routes/contact'));
  app.use('/api/testimonials', require('./backend/routes/testimonials'));
  app.use('/api/admin', require('./backend/routes/admin'));

  log('Routes loaded OK');

  // SPA fallback for admin
  app.get('/admin', (req, res) => res.redirect('/admin/login.html'));

  // Health check
  app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

  app.listen(PORT, () => {
    log('Server listening on port ' + PORT);
  });

  log('app.listen() called');

} catch (err) {
  log('FATAL ERROR: ' + err.message);
  log(err.stack);

  // Fallback: show error in browser
  const http = require('http');
  http.createServer((req, res) => {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h1>Error al arrancar AutomatIA</h1><pre>${err.stack}</pre>`);
  }).listen(process.env.PORT || 3000);
}
