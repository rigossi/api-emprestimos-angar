const axios = require('axios');
const config = require('../config');

// Modo de teste: simula envio sem chamar API real do WhatsApp
const MODO_TESTE = process.env.WHATSAPP_MODO_TESTE === 'true';

class WhatsAppService {
  async enviarNotificacao(proposta) {
    try {
      const { cliente, simulacao, id_proposta_angar } = proposta;
      
      // Gerar link de confirmação
      const linkConfirmacao = `${config.app.baseUrl}/confirmar/${id_proposta_angar}`;
      
      // Se estiver em modo de teste, simula o envio
      if (MODO_TESTE) {
        console.log('🧪 [MODO TESTE] Simulando envio de mensagem WhatsApp');
        console.log('📱 Destinatário:', cliente.whatsapp);
        console.log('👤 Cliente:', cliente.nome);
        console.log('💰 Valor:', `R$ ${simulacao.valores.solicitado.toFixed(2)}`);
        console.log('🔗 Link:', linkConfirmacao);
        console.log('📊 Dados completos:', JSON.stringify(proposta, null, 2));
        
        return {
          success: true,
          messageId: `mock_msg_${Date.now()}`,
          status: 'sent',
          mock: true,
          message: 'Mensagem simulada com sucesso (modo teste)',
          dados_enviados: {
            destinatario: cliente.whatsapp,
            nome: cliente.nome,
            valor: simulacao.valores.solicitado,
            link: linkConfirmacao
          }
        };
      }
      
      // Modo produção: envia mensagem real via API do WhatsApp
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
      
      console.log('✅ Mensagem WhatsApp enviada:', response.data);
      
      return {
        success: true,
        messageId: response.data.messages[0].id,
        mock: false
      };
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem WhatsApp:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new WhatsAppService();
