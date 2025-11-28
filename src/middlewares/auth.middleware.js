const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      error_code: 'UNAUTHORIZED',
      message: 'Token de acesso ausente ou inválido.'
    });
  }
  
  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return res.status(401).json({
        error_code: 'UNAUTHORIZED',
        message: 'Token de acesso ausente ou inválido.'
      });
    }
    
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
