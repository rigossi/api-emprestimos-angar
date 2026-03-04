const config = require('../config');

/**
 * Verifica o webhook do WhatsApp (Meta)
 * GET /v1/whatsapp/webhook
 */
exports.verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Verifica se o modo e o token estão presentes
  if (mode && token) {
    // Verifica se o modo e o token estão corretos
    // Usamos a KEY_ANGAR como token de verificação por padrão, ou um token específico se configurado
    const verifyToken = config.webhook.keyAngar || process.env.WHATSAPP_VERIFY_TOKEN || 'parcred-brasil-verify-token';

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      console.error('Falha na verificação do webhook: Token inválido');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
};

/**
 * Recebe eventos do webhook do WhatsApp
 * POST /v1/whatsapp/webhook
 */
exports.receiveWebhook = (req, res) => {
  const body = req.body;

  console.log('Webhook recebido:', JSON.stringify(body, null, 2));

  // Verifica se é um evento do WhatsApp
  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0] &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
      const from = body.entry[0].changes[0].value.messages[0].from;
      const msgBody = body.entry[0].changes[0].value.messages[0].text.body;

      console.log(`Mensagem recebida de ${from}: ${msgBody}`);
      
      // Aqui você pode adicionar a lógica para processar a resposta do cliente
      // Ex: Atualizar status da proposta, enviar resposta automática, etc.
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};
