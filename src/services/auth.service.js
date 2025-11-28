const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const clientModel = require('../models/client.model');

class AuthService {
  async authenticate(clientId, clientSecret) {
    try {
      // Buscar cliente no "banco de dados" (por enquanto, em memória)
      const client = await clientModel.findByClientId(clientId);
      
      if (!client) {
        return { success: false };
      }
      
      // Verificar senha
      const isValidPassword = await bcrypt.compare(clientSecret, client.hashedSecret);
      
      if (!isValidPassword) {
        return { success: false };
      }
      
      // Gerar token JWT
      const token = jwt.sign(
        { 
          client_id: client.client_id,
          name: client.name
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      
      return {
        success: true,
        token,
        expiresIn: config.jwt.expiresIn
      };
    } catch (error) {
      console.error('Erro na autenticação:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
