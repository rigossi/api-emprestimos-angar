const authService = require('../services/auth.service');

class AuthController {
  async login(req, res, next) {
    try {
      const { client_id, client_secret } = req.body;
      
      const result = await authService.authenticate(client_id, client_secret);
      
      if (!result.success) {
        return res.status(401).json({
          error_code: 'INVALID_CREDENTIALS',
          message: 'client_id ou client_secret inválidos.'
        });
      }
      
      res.status(200).json({
        access_token: result.token,
        token_type: 'Bearer',
        expires_in: result.expiresIn
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
