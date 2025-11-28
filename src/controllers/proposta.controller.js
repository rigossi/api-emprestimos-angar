const propostaService = require('../services/proposta.service');

class PropostaController {
  async criarProposta(req, res, next) {
    try {
      const propostaData = req.body;
      const clientId = req.user.client_id; // Vem do middleware de autenticação
      
      const result = await propostaService.criarProposta(propostaData, clientId);
      
      res.status(202).json({
        status: 'proposta_recebida_e_notificacao_enviada',
        id_proposta_angar: result.id_proposta_angar
      });
    } catch (error) {
      next(error);
    }
  }
  
  async consultarProposta(req, res, next) {
    try {
      const { id } = req.params;
      const clientId = req.user.client_id;
      
      const proposta = await propostaService.consultarProposta(id, clientId);
      
      if (!proposta) {
        return res.status(404).json({
          error_code: 'NOT_FOUND',
          message: 'Proposta não encontrada'
        });
      }
      
      res.status(200).json(proposta);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PropostaController();
