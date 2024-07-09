// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // Assegure-se de que isso está configurado no seu arquivo .env

// Middleware para verificar se o usuário está autenticado
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho Authorization

  if (!token) {
    return res.sendStatus(401); // Não autorizado
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Proibido
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
