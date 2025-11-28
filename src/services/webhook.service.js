const axios = require('axios');
const crypto = require('crypto');
const config = require('../config');

class WebhookService {
  async notificarParceiro(proposta, status, detalhes = '') {
    try {
      const payload = {
        id_proposta_angar: proposta.id_proposta_angar,
        id_proposta_parceiro: proposta.id_proposta_parceiro,
        status: status,
        timestamp: new Date().toISOString(),
        detalhes: detalhes
      };
      
      // Converter payload para string JSON
      const payloadString = JSON.stringify(payload);
      
      // Gerar assinatura HMAC-SHA256
      const signature = crypto
        .createHmac('sha256', config.webhook.keyAngar)
        .update(payloadString)
        .digest('hex');
      
      // Enviar requisição para o webhook do parceiro
      const response = await axios.post(proposta.webhook_url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Angar-Signature': signature
        },
        timeout: 10000 // 10 segundos
      });
      
      console.log('Webhook enviado com sucesso:', response.status);
      
      return {
        success: true,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Erro ao enviar webhook:', error.message);
      
      // Aqui você pode implementar retry logic ou salvar em fila para reprocessamento
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new WebhookService();
