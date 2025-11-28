// Simulação de banco de dados em memória
// Em produção, isso seria substituído por um banco de dados real (MongoDB, PostgreSQL, etc.)
const propostas = new Map();

class PropostaModel {
  async findById(idPropostaAngar) {
    return propostas.get(idPropostaAngar) || null;
  }
  
  async findByParceiroId(idPropostaParceiro) {
    for (const proposta of propostas.values()) {
      if (proposta.id_proposta_parceiro === idPropostaParceiro) {
        return proposta;
      }
    }
    return null;
  }
  
  async save(proposta) {
    propostas.set(proposta.id_proposta_angar, proposta);
    return proposta;
  }
  
  async update(proposta) {
    if (!propostas.has(proposta.id_proposta_angar)) {
      throw new Error('Proposta não encontrada');
    }
    propostas.set(proposta.id_proposta_angar, proposta);
    return proposta;
  }
  
  async delete(idPropostaAngar) {
    return propostas.delete(idPropostaAngar);
  }
  
  async findAll() {
    return Array.from(propostas.values());
  }
  
  async findByClientId(clientId) {
    const result = [];
    for (const proposta of propostas.values()) {
      if (proposta.client_id === clientId) {
        result.push(proposta);
      }
    }
    return result;
  }
}

module.exports = new PropostaModel();
