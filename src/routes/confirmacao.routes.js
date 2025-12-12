const express = require('express');
const confirmacaoController = require('../controllers/confirmacao.controller');

const router = express.Router();

// GET /confirmar/:id?acao=aceitar ou recusar
router.get('/:id', confirmacaoController.confirmarProposta);

module.exports = router;
