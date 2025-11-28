const axios = require('axios');
const config = require('../config');

class WhatsAppService {
  async enviarNotificacao(proposta) {
    try {
      const { cliente, simulacao, id_proposta_angar } = proposta;
      
      // Gerar link de confirmação
      const linkConfirmacao = `${config.app.baseUrl}/confirmar/${id_proposta_angar}`;
      
      // Preparar dados para o template do WhatsApp
      const messageData = {
        messaging_product: 'whatsapp',
        to: cliente.whatsapp,
        type: 'template',
        template: {
          name: config.whatsapp.templateName,
          language: {
            code: 'pt_BR'
          },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: cliente.nome },
                { type: 'text', text: `R$ ${simulacao.valores.solicitado.toFixed(2)}` },
                { type: 'text', text: linkConfirmacao }
              ]
            }
          ]
        }
      };
      
      // Enviar mensagem via API do WhatsApp
      const url = `${config.whatsapp.apiUrl}/${config.whatsapp.phoneNumberId}/messages`;
      
      const response = await axios.post(url, messageData, {
        headers: {
          'Authorization': `Bearer ${config.whatsapp.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Mensagem WhatsApp enviada:', response.data);
      
      return {
        success: true,
        messageId: response.data.messages[0].id
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new WhatsAppService();
