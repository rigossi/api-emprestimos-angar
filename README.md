# API de Empréstimos Angar

API para integração com sistemas parceiros, permitindo o envio de propostas de empréstimo pessoal e notificação de clientes via WhatsApp.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Documentação da API](#documentação-da-api)
- [Testes](#testes)

## 🎯 Visão Geral

Esta API permite que sistemas parceiros enviem propostas de empréstimo pessoal. O fluxo funciona da seguinte forma:

1. O parceiro se autentica na API usando credenciais (client_id e client_secret)
2. O parceiro envia os dados da proposta de empréstimo
3. A API envia uma mensagem via WhatsApp para o cliente final
4. O cliente aceita ou recusa a proposta
5. A API notifica o parceiro via webhook sobre a decisão do cliente

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **JWT** - Autenticação via tokens
- **Joi** - Validação de dados
- **Axios** - Cliente HTTP
- **Bcrypt** - Hash de senhas
- **WhatsApp Business API** - Envio de mensagens

## 📁 Estrutura do Projeto

```
api-emprestimos-angar/
├── src/
│   ├── config/           # Configurações da aplicação
│   ├── controllers/      # Controladores (lógica de requisição/resposta)
│   ├── middlewares/      # Middlewares (autenticação, validação)
│   ├── models/           # Modelos de dados
│   ├── routes/           # Definição de rotas
│   ├── services/         # Lógica de negócio
│   ├── utils/            # Utilitários e helpers
│   └── server.js         # Arquivo principal do servidor
├── docs/                 # Documentação adicional
├── tests/                # Testes automatizados
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd api-emprestimos-angar
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

## ⚙️ Configuração

Edite o arquivo `.env` com as seguintes variáveis:

```env
# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRES_IN=3600

# WhatsApp Business API
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_ACCESS_TOKEN=seu_token_de_acesso
WHATSAPP_TEMPLATE_NAME=proposta_emprestimo_confirmacao

# Webhook
KEY_ANGAR=sua_chave_secreta_webhook

# App
APP_BASE_URL=https://api.angar.com.br
```

## 🎮 Uso

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

### Testes

```bash
npm test
```

## 📖 Documentação da API

A documentação completa da API está disponível em formato OpenAPI 3.0 no arquivo `docs/openapi.yaml`.

### Endpoints Principais

#### POST /v1/login
Autentica o parceiro e retorna um token JWT.

**Request:**
```json
{
  "client_id": "parceiro_abc_123",
  "client_secret": "dK$!s#@j9sA*d(s@D*j"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

#### POST /v1/propostas
Cria uma nova proposta de empréstimo.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:** Veja a documentação OpenAPI para o schema completo.

**Response:**
```json
{
  "status": "proposta_recebida_e_notificacao_enviada",
  "id_proposta_angar": "ANG-1c7b82d3-a4e5-4f6g-8h9i-j0k1l2m3n4o5"
}
```

### Webhook

Quando o cliente aceita ou recusa a proposta, a API envia uma notificação para a `webhook_url` configurada:

**Headers:**
```
X-Angar-Signature: {hmac_sha256_signature}
```

**Payload:**
```json
{
  "id_proposta_angar": "ANG-1c7b82d3-a4e5-4f6g-8h9i-j0k1l2m3n4o5",
  "id_proposta_parceiro": "PROP-XYZ-9876",
  "status": "CLIENTE_ACEITOU",
  "timestamp": "2025-11-20T14:30:00Z",
  "detalhes": "O cliente confirmou a proposta com sucesso."
}
```

## 🧪 Testes

Para executar os testes:

```bash
npm test
```

Para executar os testes em modo watch:

```bash
npm run test:watch
```

## 📝 Licença

ISC

## 👥 Suporte

Para suporte técnico, entre em contato: dev@angar.com.br
