const express = require('express');
const authController = require('../controllers/auth.controller');
const { validateLogin } = require('../middlewares/validation.middleware');

const router = express.Router();

// POST /v1/login
router.post('/', validateLogin, authController.login);

module.exports = router;
