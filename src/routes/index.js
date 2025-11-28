const express = require('express');
const authRoutes = require('./auth.routes');
const propostaRoutes = require('./proposta.routes');

const router = express.Router();

// Rotas de autenticação
router.use('/login', authRoutes);

// Rotas de propostas
router.use('/propostas', propostaRoutes);

module.exports = router;
