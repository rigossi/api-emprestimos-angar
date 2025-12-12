const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const routes = require('./routes');

const app = express();

// Middlewares de segurança e utilitários
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/v1', routes);

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error_code: 'NOT_FOUND',
    message: 'Endpoint não encontrado'
  });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  
  res.status(err.status || 500).json({
    error_code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Ocorreu um erro inesperado',
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
const server = app.listen(config.port, () => {
  console.log(`[SERVER] Servidor rodando na porta ${config.port}`);
  console.log(`[SERVER] Ambiente: ${config.nodeEnv}`);
});

module.exports = { app, server };
