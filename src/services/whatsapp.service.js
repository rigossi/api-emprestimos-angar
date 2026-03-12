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
      
      // Formatar valores para exibição (pt-BR)
      const valorSolicitado = simulacao.valores.solicitado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const valorBruto = simulacao.valores.bruto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const valorParcela = simulacao.valores.parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const taxaMensal = simulacao.taxas.cet_am.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const qtdParcelas = simulacao.prazos.total_parcelas.toString();

      // Se estiver em modo de teste, simula o envio
      if (MODO_TESTE) {
        console.log('[MODO TESTE] Simulando envio de mensagem WhatsApp');
        console.log('Destinatario:', cliente.whatsapp);
        console.log('Cliente:', cliente.nome);
        console.log('Valor Solicitado:', `R$ ${valorSolicitado}`);
        console.log('Parcelas:', qtdParcelas);
        console.log('Taxa:', `${taxaMensal}%`);
        console.log('Valor Bruto:', `R$ ${valorBruto}`);
        console.log('Valor Parcela:', `R$ ${valorParcela}`);
        console.log('Link:', linkConfirmacao);
        
        return {
          success: true,
          messageId: `mock_msg_${Date.now()}`,
          status: 'sent',
          mock: true,
          message: 'Mensagem simulada com sucesso (modo teste)',
          dados_enviados: {
            destinatario: cliente.whatsapp,
            nome: cliente.nome,
            valor: valorSolicitado,
            parcelas: qtdParcelas,
            taxa: taxaMensal,
            bruto: valorBruto,
            valor_parcela: valorParcela
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
                { type: 'text', text: cliente.nome }, // {{1}} Nome
                { type: 'text', text: valorSolicitado }, // {{2}} Valor Solicitado
                { type: 'text', text: qtdParcelas }, // {{3}} Parcelas
                { type: 'text', text: taxaMensal }, // {{4}} Taxa a.m.
                { type: 'text', text: valorBruto }, // {{5}} Valor Bruto
                { type: 'text', text: valorParcela } // {{6}} Valor Parcela
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
      
      console.log('[WhatsApp] Mensagem enviada com sucesso:', response.data);
      
      return {
        success: true,
        messageId: response.data.messages[0].id,
        mock: false
      };
    } catch (error) {
      console.error('[WhatsApp] Erro ao enviar mensagem:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new WhatsAppService();
