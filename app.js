const fs = require('fs');
const path = require('path');

// ── Debug log (writes to file so we can check on server) ──
const LOG_FILE = path.join(__dirname, 'app-debug.log');
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { fs.appendFileSync(LOG_FILE, line); } catch(e) {}
  console.log(msg);
  console.error(msg); // also write to stderr.log
}

process.on('uncaughtException', (err) => {
  log('UNCAUGHT EXCEPTION: ' + err.message);
  log(err.stack);
});
process.on('unhandledRejection', (err) => {
  log('UNHANDLED REJECTION: ' + (err && err.message ? err.message : err));
});

log('=== APP.JS STARTING ===');
log('CWD: ' + process.cwd());
log('__dirname: ' + __dirname);
log('NODE_ENV: ' + process.env.NODE_ENV);
log('Node version: ' + process.version);

try {
  // Load .env
  const envPath = path.join(__dirname, '.env');
  log('.env exists: ' + fs.existsSync(envPath));
  require('dotenv').config({ path: envPath });
  log('.env loaded');

  const express = require('express');
  log('express loaded');
  const rateLimit = require('express-rate-limit');
  log('rate-limit loaded');
  const { initDB } = require('./backend/database');
  log('database loaded');

  const app = express();

  initDB();
  log('DB initialized');

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve frontend files
  const frontendDir = path.join(__dirname, 'frontend');
  log('Frontend dir: ' + frontendDir + ' exists: ' + fs.existsSync(frontendDir));
  app.use(express.static(frontendDir));
  app.use('/AutomatIA', express.static(frontendDir));

  // Rate limiting
  const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
  const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Demasiados envíos. Inténtalo en una hora.' }
  });

  app.use('/api/', apiLimiter);

  // Routes (mount on both /api and /AutomatIA/api for frontend compatibility)
  app.use('/api/contact', contactLimiter, require('./backend/routes/contact'));
  app.use('/api/testimonials', require('./backend/routes/testimonials'));
  app.use('/api/admin', require('./backend/routes/admin'));
  app.use('/AutomatIA/api/contact', contactLimiter, require('./backend/routes/contact'));
  app.use('/AutomatIA/api/testimonials', require('./backend/routes/testimonials'));
  app.use('/AutomatIA/api/admin', require('./backend/routes/admin'));
  log('Routes loaded');

  // Admin redirect
  app.get('/admin', (req, res) => res.redirect('/AutomatIA/admin/login.html'));

  // Health check
  app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

  // Log every request for debugging
  app.use((req, res, next) => {
    log('REQUEST: ' + req.method + ' ' + req.url);
    next();
  });

  // Start server — Passenger will hook into this
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    log('Server listening on port ' + PORT);
  });

  log('app.listen() called — waiting for Passenger/port');

} catch (err) {
  log('FATAL ERROR: ' + err.message);
  log(err.stack);

  // Emergency fallback — show error in browser
  const http = require('http');
  const PORT = process.env.PORT || 3000;
  http.createServer((req, res) => {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Error al arrancar AutomatIA</h1><pre>' + err.stack + '</pre>');
  }).listen(PORT);
}
