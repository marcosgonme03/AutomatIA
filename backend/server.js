require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { initDB } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Init database
initDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

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

// SPA fallback for admin
app.get('/admin', (req, res) => res.redirect('/admin/login.html'));

app.listen(PORT, () => {
  console.log(`\n🚀 AutomatIA Pro corriendo en http://localhost:${PORT}`);
  console.log(`🔐 Admin panel: http://localhost:${PORT}/admin/login.html\n`);
});
