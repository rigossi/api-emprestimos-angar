/**
 * Formata um número para moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata uma data para o padrão brasileiro
 * @param {string} dateString - Data no formato ISO ou AAAA-MM-DD
 * @returns {string} Data formatada DD/MM/AAAA
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

/**
 * Formata CPF
 * @param {string} cpf - CPF sem formatação
 * @returns {string} CPF formatado XXX.XXX.XXX-XX
 */
function formatCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Remove formatação do CPF
 * @param {string} cpf - CPF formatado
 * @returns {string} CPF sem formatação
 */
function unformatCPF(cpf) {
  return cpf.replace(/\D/g, '');
}

/**
 * Valida formato de WhatsApp (E.164)
 * @param {string} whatsapp - Número do WhatsApp
 * @returns {boolean} True se válido
 */
function isValidWhatsApp(whatsapp) {
  return /^\d{13}$/.test(whatsapp);
}

module.exports = {
  formatCurrency,
  formatDate,
  formatCPF,
  unformatCPF,
  isValidWhatsApp
};
