const propostaModel = require('../models/proposta.model');
const webhookService = require('../services/webhook.service');

class ConfirmacaoController {
  // GET /confirmar/:id?acao=aceitar ou recusar
  async confirmarProposta(req, res) {
    try {
      const { id } = req.params;
      const { acao } = req.query; // 'aceitar' ou 'recusar'
      
      // Validar ação
      if (!acao || !['aceitar', 'recusar'].includes(acao.toLowerCase())) {
        return res.status(400).json({
          error_code: 'INVALID_ACTION',
          message: 'Ação inválida. Use "aceitar" ou "recusar"'
        });
      }
      
      // Buscar proposta
      const proposta = propostaModel.buscarPorId(id);
      
      if (!proposta) {
        return res.status(404).json({
          error_code: 'PROPOSTA_NOT_FOUND',
          message: 'Proposta não encontrada'
        });
      }
      
      // Verificar se já foi respondida
      if (proposta.status !== 'AGUARDANDO_CLIENTE') {
        return res.status(400).json({
          error_code: 'PROPOSTA_ALREADY_ANSWERED',
          message: 'Esta proposta já foi respondida',
          status_atual: proposta.status
        });
      }
      
      // Atualizar status
      const novoStatus = acao.toLowerCase() === 'aceitar' ? 'ACEITO' : 'RECUSADO';
      propostaModel.atualizarStatus(id, novoStatus);
      
      // Enviar webhook para o parceiro
      const webhookResult = await webhookService.notificarParceiro(proposta, novoStatus);
      
      // Retornar página HTML simples
      const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmação de Proposta</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.2);
              text-align: center;
              max-width: 500px;
            }
            .icon {
              font-size: 64px;
              margin-bottom: 20px;
            }
            .success { color: #10b981; }
            .error { color: #ef4444; }
            h1 { color: #1f2937; margin-bottom: 10px; }
            p { color: #6b7280; line-height: 1.6; }
            .details {
              background: #f3f4f6;
              padding: 20px;
              border-radius: 5px;
              margin-top: 20px;
              text-align: left;
            }
            .details strong { color: #374151; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon ${novoStatus === 'ACEITO' ? 'success' : 'error'}">
              ${novoStatus === 'ACEITO' ? '✓' : '✗'}
            </div>
            <h1>${novoStatus === 'ACEITO' ? 'Proposta Aceita!' : 'Proposta Recusada'}</h1>
            <p>
              ${novoStatus === 'ACEITO' 
                ? 'Sua proposta foi aceita com sucesso. Em breve entraremos em contato para finalizar o processo.' 
                : 'Sua proposta foi recusada. Agradecemos seu interesse.'}
            </p>
            <div class="details">
              <p><strong>ID da Proposta:</strong> ${id}</p>
              <p><strong>Cliente:</strong> ${proposta.cliente.nome}</p>
              <p><strong>Valor:</strong> R$ ${proposta.simulacao.valores.solicitado.toFixed(2)}</p>
              <p><strong>Status:</strong> ${novoStatus}</p>
              <p><strong>Webhook notificado:</strong> ${webhookResult.success ? 'Sim' : 'Erro'}</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      res.send(html);
      
    } catch (error) {
      console.error('[Confirmacao] Erro ao processar confirmação:', error);
      res.status(500).json({
        error_code: 'INTERNAL_ERROR',
        message: 'Erro ao processar confirmação'
      });
    }
  }
}

module.exports = new ConfirmacaoController();
