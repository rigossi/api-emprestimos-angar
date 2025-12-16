const bcrypt = require('bcryptjs');

// Simulação de banco de dados em memória
// Em produção, isso seria substituído por um banco de dados real (MongoDB, PostgreSQL, etc.)
const clients = new Map();

// Inicializar clientes a partir de variáveis de ambiente
const initializeClients = async () => {
  // Cliente de teste (manter para compatibilidade)
  const hashedSecretTeste = await bcrypt.hash('dK$!s#@j9sA*d(s@D*j', 10);
  
  clients.set('parceiro_abc_123', {
    client_id: 'parceiro_abc_123',
    name: 'Parceiro ABC',
    hashedSecret: hashedSecretTeste,
    created_at: new Date().toISOString()
  });

  // Parceiro Banksoft - credenciais de variáveis de ambiente
  const banksoftClientId = process.env.PARCEIRO_BANKSOFT_CLIENT_ID;
  const banksoftClientSecret = process.env.PARCEIRO_BANKSOFT_CLIENT_SECRET;
  
  if (banksoftClientId && banksoftClientSecret) {
    const hashedSecretBanksoft = await bcrypt.hash(banksoftClientSecret, 10);
    
    clients.set(banksoftClientId, {
      client_id: banksoftClientId,
      name: 'Banksoft',
      hashedSecret: hashedSecretBanksoft,
      key_angar: process.env.PARCEIRO_BANKSOFT_KEY_ANGAR || '',
      created_at: new Date().toISOString()
    });
    
    console.log(`[INFO] Parceiro Banksoft cadastrado com client_id: ${banksoftClientId}`);
  } else {
    console.log('[WARN] Credenciais do parceiro Banksoft não encontradas nas variáveis de ambiente');
  }
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
