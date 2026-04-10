const fs = require('fs');
const path = require('path');

// ── Debug log (writes to file so we can check on server) ──
const LOG_FILE = process.env.VERCEL ? '/tmp/app-debug.log' : path.join(__dirname, 'app-debug.log');
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
  const { initDB } = require('./database');
  log('database loaded');

  const app = express();

  initDB();
  log('DB initialized');

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from public_html
  const publicDir = path.join(__dirname, 'public_html');
  log('Serving static files from: ' + publicDir);
  app.use(express.static(publicDir));

  // Rate limiting
  const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
  const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Demasiados envíos. Inténtalo en una hora.' }
  });

  app.use('/api/', apiLimiter);

  // Routes
  app.use('/api/contact', contactLimiter, require('./routes/contact'));
  app.use('/api/testimonials', require('./routes/testimonials'));
  app.use('/api/admin', require('./routes/admin'));
  log('Routes loaded');

  app.get('/admin', (req, res) => res.redirect('/admin/login.html'));

  // Health check
  app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

  // Log every request for debugging
  app.use((req, res, next) => {
    log('REQUEST: ' + req.method + ' ' + req.url);
    next();
  });

  // Start server (only when not on Vercel — Vercel uses the export)
  if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      log('Server listening on port ' + PORT);
    });
    log('app.listen() called — waiting for Passenger/port');
  }

  // Export for Vercel serverless
  module.exports = app;

} catch (err) {
  log('FATAL ERROR: ' + err.message);
  log(err.stack);

  // Emergency fallback — show error in browser
  if (!process.env.VERCEL) {
    const http = require('http');
    const PORT = process.env.PORT || 3000;
    http.createServer((req, res) => {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>Error al arrancar AutomatIA</h1><pre>' + err.stack + '</pre>');
    }).listen(PORT);
  }
}
