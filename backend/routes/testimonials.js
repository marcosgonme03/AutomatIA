const express    = require('express');
const router     = express.Router();
const { stores } = require('../database');

router.get('/', (req, res) => {
  const published = stores.testimonials.all({ published: 1 })
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || a.id - b.id);
  res.json(published);
});

module.exports = router;
