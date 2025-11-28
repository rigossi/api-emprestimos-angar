const { v4: uuidv4 } = require('uuid');
const whatsappService = require('./whatsapp.service');
const propostaModel = require('../models/proposta.model');

class PropostaService {
  async criarProposta(propostaData, clientId) {
    try {
      // Gerar ID único para a proposta
      const idPropostaAngar = `ANG-${uuidv4()}`;
      
      // Salvar proposta no "banco de dados"
      const proposta = {
        id_proposta_angar: idPropostaAngar,
        id_proposta_parceiro: propostaData.id_proposta_parceiro,
        client_id: clientId,
        cliente: propostaData.cliente,
        simulacao: propostaData.simulacao,
        webhook_url: propostaData.webhook_url,
        status: 'AGUARDANDO_CLIENTE',
        created_at: new Date().toISOString()
      };
      
      await propostaModel.save(proposta);
      
      // Enviar mensagem via WhatsApp
      await whatsappService.enviarNotificacao(proposta);
      
      return { id_proposta_angar: idPropostaAngar };
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      throw error;
    }
  }
  
  async consultarProposta(idPropostaAngar, clientId) {
    try {
      const proposta = await propostaModel.findById(idPropostaAngar);
      
      // Verificar se a proposta pertence ao cliente
      if (proposta && proposta.client_id !== clientId) {
        return null;
      }
      
      return proposta;
    } catch (error) {
      console.error('Erro ao consultar proposta:', error);
      throw error;
    }
  }
  
  async atualizarStatus(idPropostaAngar, novoStatus, detalhes = '') {
    try {
      const proposta = await propostaModel.findById(idPropostaAngar);
      
      if (!proposta) {
        throw new Error('Proposta não encontrada');
      }
      
      proposta.status = novoStatus;
      proposta.updated_at = new Date().toISOString();
      
      await propostaModel.update(proposta);
      
      // Notificar o parceiro via webhook
      const webhookService = require('./webhook.service');
      await webhookService.notificarParceiro(proposta, novoStatus, detalhes);
      
      return proposta;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }
}

module.exports = new PropostaService();
