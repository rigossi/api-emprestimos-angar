const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');

// Rota para verificação do Webhook (GET)
router.get('/webhook', whatsappController.verifyWebhook);

// Rota para receber eventos do Webhook (POST)
router.post('/webhook', whatsappController.receiveWebhook);

module.exports = router;
