const express = require('express');
const propostaController = require('../controllers/proposta.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validateProposta } = require('../middlewares/validation.middleware');

const router = express.Router();

// POST /v1/propostas
router.post('/', authenticateToken, validateProposta, propostaController.criarProposta);

// GET /v1/propostas/:id (para consulta de status - opcional)
router.get('/:id', authenticateToken, propostaController.consultarProposta);

module.exports = router;
