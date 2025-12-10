require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN) || 3600
  },
  
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    templateName: process.env.WHATSAPP_TEMPLATE_NAME,
    modoTeste: process.env.WHATSAPP_MODO_TESTE === 'true'
  },
  
  webhook: {
    keyAngar: process.env.KEY_ANGAR
  },
  
  app: {
    baseUrl: process.env.APP_BASE_URL
  }
};
