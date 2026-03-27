const axios = require('axios');
const config = require('../config');

// Modo de teste: simula envio sem chamar API real do WhatsApp
const MODO_TESTE = process.env.WHATSAPP_MODO_TESTE === 'true';

class WhatsAppService {
  async enviarNotificacao(proposta) {
    try {
      const { cliente, simulacao, data_solicitacao, id_proposta_angar } = proposta;
      
      // Formatar datas (de YYYY-MM-DD para DD/MM/YYYY)
      const formatarData = (dataStr) => {
        if (!dataStr) return '';
        const [ano, mes, dia] = dataStr.split('-');
        return `${dia}/${mes}/${ano}`;
      };
      
      const dataSolicitacaoFormatada = formatarData(data_solicitacao);
      const dataLiberacaoFormatada = formatarData(simulacao.prazos.data_liberacao_estimada);
      
      // Formatar valores para exibição (pt-BR)
      const valorLiberado = simulacao.valores.liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const valorIof = simulacao.valores.iof.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const valorParcela = simulacao.valores.parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const taxaNominal = simulacao.taxas.nominal_am.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const qtdParcelas = simulacao.prazos.total_parcelas.toString();

      // Se estiver em modo de teste, simula o envio
      if (MODO_TESTE) {
        console.log('[MODO TESTE] Simulando envio de mensagem WhatsApp');
        console.log('Destinatario:', cliente.whatsapp);
        console.log('Cliente:', cliente.nome);
        console.log('Data Solicitação:', dataSolicitacaoFormatada);
        console.log('Valor Liberado:', `R$ ${valorLiberado}`);
        console.log('Data Liberação:', dataLiberacaoFormatada);
        console.log('Taxa Nominal:', `${taxaNominal}%`);
        console.log('IOF:', `R$ ${valorIof}`);
        console.log('Prazo:', `${qtdParcelas} meses`);
        console.log('Parcelas mensais:', `R$ ${valorParcela}`);
        
        return {
          success: true,
          messageId: `mock_msg_${Date.now()}`,
          status: 'sent',
          mock: true,
          message: 'Mensagem simulada com sucesso (modo teste)',
          dados_enviados: {
            destinatario: cliente.whatsapp,
            nome: cliente.nome,
            data_solicitacao: dataSolicitacaoFormatada,
            valor_liberado: valorLiberado,
            data_liberacao: dataLiberacaoFormatada,
            taxa_nominal: taxaNominal,
            iof: valorIof,
            prazo: qtdParcelas,
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
                { type: 'text', text: dataSolicitacaoFormatada }, // {{2}} Data da solicitação
                { type: 'text', text: valorLiberado }, // {{3}} Valor liberado
                { type: 'text', text: dataLiberacaoFormatada }, // {{4}} Data de liberação
                { type: 'text', text: taxaNominal }, // {{5}} Taxa nominal
                { type: 'text', text: valorIof }, // {{6}} IOF
                { type: 'text', text: qtdParcelas }, // {{7}} Prazo
                { type: 'text', text: valorParcela } // {{8}} Parcelas mensais
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
