const Joi = require('joi');

// Schema de validação para login
const loginSchema = Joi.object({
  client_id: Joi.string().required(),
  client_secret: Joi.string().required()
});

// Schema de validação para proposta
const propostaSchema = Joi.object({
  id_proposta_parceiro: Joi.string().required(),
  cliente: Joi.object({
    nome: Joi.string().required(),
    cpf: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).required(),
    whatsapp: Joi.string().pattern(/^\d{13}$/).required()
  }).required(),
  simulacao: Joi.object({
    valores: Joi.object({
      solicitado: Joi.number().positive().required(),
      iof: Joi.number().min(0).required(),
      principal: Joi.number().positive().required(),
      parcela: Joi.number().positive().required(),
      liquido: Joi.number().positive().required(),
      bruto: Joi.number().positive().required()
    }).required(),
    taxas: Joi.object({
      cet_am: Joi.number().min(0).required(),
      cet_aa: Joi.number().min(0).required()
    }).required(),
    prazos: Joi.object({
      total_parcelas: Joi.number().integer().positive().required(),
      primeiro_vencimento: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
      ultimo_vencimento: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
    }).required()
  }).required(),
  webhook_url: Joi.string().uri().required()
});

function validateLogin(req, res, next) {
  const { error } = loginSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error_code: 'BAD_REQUEST',
      message: 'A requisição contém dados inválidos.',
      details: error.details.map(d => d.message)
    });
  }
  
  next();
}

function validateProposta(req, res, next) {
  const { error } = propostaSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error_code: 'BAD_REQUEST',
      message: 'A requisição contém dados inválidos.',
      details: error.details.map(d => d.message)
    });
  }
  
  next();
}

module.exports = { validateLogin, validateProposta };
