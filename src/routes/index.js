const express = require('express');
const authRoutes = require('./auth.routes');
const propostaRoutes = require('./proposta.routes');
const whatsappRoutes = require('./whatsapp.routes');

const router = express.Router();

// Rotas de autenticação
router.use('/login', authRoutes);

// Rotas de propostas
router.use('/propostas', propostaRoutes);

// Rotas do WhatsApp Webhook
router.use('/whatsapp', whatsappRoutes);

module.exports = router;
