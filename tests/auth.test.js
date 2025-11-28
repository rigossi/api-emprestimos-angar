const request = require('supertest');
const { app } = require('../src/server');

describe('Autenticação', () => {
  describe('POST /v1/login', () => {
    it('deve retornar token JWT com credenciais válidas', async () => {
      const response = await request(app)
        .post('/v1/login')
        .send({
          client_id: 'parceiro_abc_123',
          client_secret: 'dK$!s#@j9sA*d(s@D*j'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('token_type', 'Bearer');
      expect(response.body).toHaveProperty('expires_in');
    });

    it('deve retornar erro 401 com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/v1/login')
        .send({
          client_id: 'invalido',
          client_secret: 'invalido'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error_code', 'INVALID_CREDENTIALS');
    });

    it('deve retornar erro 400 quando faltam campos obrigatórios', async () => {
      const response = await request(app)
        .post('/v1/login')
        .send({
          client_id: 'parceiro_abc_123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error_code', 'BAD_REQUEST');
    });
  });
});
