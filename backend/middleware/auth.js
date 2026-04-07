const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const token = auth.slice(7);
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
