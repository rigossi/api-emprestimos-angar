const bcrypt = require('bcryptjs');

// Simulação de banco de dados em memória
// Em produção, isso seria substituído por um banco de dados real (MongoDB, PostgreSQL, etc.)
const clients = new Map();

// Adicionar um cliente de exemplo (para testes)
const initializeClients = async () => {
  const hashedSecret = await bcrypt.hash('dK$!s#@j9sA*d(s@D*j', 10);
  
  clients.set('parceiro_abc_123', {
    client_id: 'parceiro_abc_123',
    name: 'Parceiro ABC',
    hashedSecret: hashedSecret,
    created_at: new Date().toISOString()
  });
};

// Inicializar clientes
initializeClients();

class ClientModel {
  async findByClientId(clientId) {
    return clients.get(clientId) || null;
  }
  
  async save(client) {
    clients.set(client.client_id, client);
    return client;
  }
  
  async update(client) {
    if (!clients.has(client.client_id)) {
      throw new Error('Cliente não encontrado');
    }
    clients.set(client.client_id, client);
    return client;
  }
  
  async delete(clientId) {
    return clients.delete(clientId);
  }
}

module.exports = new ClientModel();
