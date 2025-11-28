# Estrutura do Projeto - API de Empréstimos Angar

## Visão Geral da Arquitetura

Este projeto segue uma arquitetura em camadas (layered architecture) com separação clara de responsabilidades:

```
┌─────────────────────────────────────────┐
│          Camada de Rotas                │  ← Define endpoints HTTP
├─────────────────────────────────────────┤
│       Camada de Controllers             │  ← Processa requisições/respostas
├─────────────────────────────────────────┤
│        Camada de Services               │  ← Lógica de negócio
├─────────────────────────────────────────┤
│         Camada de Models                │  ← Acesso a dados
└─────────────────────────────────────────┘
```

## Estrutura de Diretórios

```
api-emprestimos-angar/
│
├── src/                          # Código fonte da aplicação
│   ├── config/                   # Configurações centralizadas
│   │   └── index.js              # Carrega variáveis de ambiente
│   │
│   ├── controllers/              # Controladores (requisição → resposta)
│   │   ├── auth.controller.js    # Lógica de autenticação
│   │   └── proposta.controller.js # Lógica de propostas
│   │
│   ├── middlewares/              # Middlewares do Express
│   │   ├── auth.middleware.js    # Verificação de token JWT
│   │   └── validation.middleware.js # Validação de payloads (Joi)
│   │
│   ├── models/                   # Modelos de dados (camada de persistência)
│   │   ├── client.model.js       # Gerencia dados de clientes parceiros
│   │   └── proposta.model.js     # Gerencia dados de propostas
│   │
│   ├── routes/                   # Definição de rotas HTTP
│   │   ├── index.js              # Agregador de rotas
│   │   ├── auth.routes.js        # Rotas de autenticação
│   │   └── proposta.routes.js    # Rotas de propostas
│   │
│   ├── services/                 # Lógica de negócio
│   │   ├── auth.service.js       # Autenticação e geração de tokens
│   │   ├── proposta.service.js   # Processamento de propostas
│   │   ├── whatsapp.service.js   # Integração com WhatsApp API
│   │   └── webhook.service.js    # Notificação de parceiros
│   │
│   ├── utils/                    # Utilitários e helpers
│   │   └── format.js             # Formatação de dados (moeda, data, CPF)
│   │
│   └── server.js                 # Ponto de entrada da aplicação
│
├── docs/                         # Documentação do projeto
│   ├── openapi.yaml              # Especificação OpenAPI 3.0
│   └── whatsapp-setup.md         # Guia de configuração do WhatsApp
│
├── tests/                        # Testes automatizados
│   └── auth.test.js              # Testes de autenticação
│
├── .env.example                  # Exemplo de variáveis de ambiente
├── .gitignore                    # Arquivos ignorados pelo Git
├── jest.config.js                # Configuração do Jest
├── package.json                  # Dependências e scripts
├── README.md                     # Documentação principal
└── ESTRUTURA_PROJETO.md          # Este arquivo
```

## Fluxo de Dados

### 1. Autenticação (POST /v1/login)

```
Cliente → Route → Controller → Service → Model
                                    ↓
                              Gera JWT Token
                                    ↓
Cliente ← Response ← Controller ← Service
```

### 2. Criação de Proposta (POST /v1/propostas)

```
Cliente → Route → Auth Middleware → Validation Middleware
                        ↓
                  Controller → Service → Model (salva proposta)
                                    ↓
                              WhatsApp Service (envia mensagem)
                                    ↓
Cliente ← Response ← Controller ← Service
```

### 3. Notificação via Webhook

```
Cliente aceita/recusa → Service atualiza status
                            ↓
                    Webhook Service
                            ↓
                  Gera assinatura HMAC
                            ↓
                  POST para webhook_url do parceiro
```

## Descrição dos Componentes

### Controllers
Responsáveis por receber requisições HTTP, chamar os services apropriados e retornar respostas formatadas.

**Exemplo:**
```javascript
async criarProposta(req, res, next) {
  const result = await propostaService.criarProposta(req.body);
  res.status(202).json(result);
}
```

### Services
Contêm a lógica de negócio da aplicação. Não conhecem detalhes de HTTP.

**Exemplo:**
```javascript
async criarProposta(propostaData) {
  const id = gerarId();
  await propostaModel.save({ id, ...propostaData });
  await whatsappService.enviarNotificacao(propostaData);
  return { id };
}
```

### Models
Gerenciam a persistência de dados. Atualmente usam estruturas em memória (Map), mas podem ser facilmente substituídos por bancos de dados reais.

**Exemplo:**
```javascript
async save(proposta) {
  propostas.set(proposta.id, proposta);
  return proposta;
}
```

### Middlewares
Funções que interceptam requisições antes de chegarem aos controllers.

**auth.middleware.js:** Verifica se o token JWT é válido
**validation.middleware.js:** Valida o formato dos dados recebidos

### Routes
Definem os endpoints HTTP e conectam URLs aos controllers.

**Exemplo:**
```javascript
router.post('/', authenticateToken, validateProposta, propostaController.criarProposta);
```

## Padrões de Código

### Nomenclatura
- **Arquivos:** snake_case (ex: `auth.controller.js`)
- **Classes:** PascalCase (ex: `AuthService`)
- **Funções/Variáveis:** camelCase (ex: `criarProposta`)
- **Constantes:** UPPER_SNAKE_CASE (ex: `JWT_SECRET`)

### Estrutura de Resposta de Erro
```json
{
  "error_code": "CODIGO_DO_ERRO",
  "message": "Mensagem descritiva",
  "details": ["Detalhes adicionais opcionais"]
}
```

### Estrutura de Resposta de Sucesso
```json
{
  "status": "descricao_do_status",
  "data": { /* dados relevantes */ }
}
```

## Segurança

### Autenticação
- JWT com expiração configurável
- Senhas hasheadas com bcrypt
- Token enviado via header `Authorization: Bearer {token}`

### Webhook
- Assinatura HMAC-SHA256 no header `X-Angar-Signature`
- Permite que o parceiro valide a autenticidade da requisição

### Middlewares de Segurança
- **helmet:** Adiciona headers de segurança HTTP
- **cors:** Controla acesso cross-origin
- **express.json():** Limita tamanho de payloads

## Próximos Passos para Produção

### 1. Banco de Dados
Substituir os models em memória por:
- **MongoDB** (NoSQL) - Ideal para documentos JSON
- **PostgreSQL** (SQL) - Ideal para dados relacionais

### 2. Autenticação Avançada
- Implementar refresh tokens
- Adicionar rate limiting
- Implementar OAuth2 para parceiros

### 3. Monitoramento
- Adicionar logs estruturados (Winston, Pino)
- Implementar APM (Application Performance Monitoring)
- Configurar alertas para erros

### 4. Infraestrutura
- Configurar CI/CD (GitHub Actions, GitLab CI)
- Deploy em plataforma cloud (Render, Heroku, AWS)
- Configurar load balancer e auto-scaling

### 5. Testes
- Aumentar cobertura de testes
- Adicionar testes de integração
- Implementar testes E2E

## Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (com hot-reload)
npm run dev

# Rodar em produção
npm start

# Executar testes
npm test

# Executar testes com cobertura
npm test -- --coverage

# Verificar estrutura do projeto
tree -I node_modules
```

## Recursos Adicionais

- [Documentação OpenAPI](./docs/openapi.yaml)
- [Guia de Configuração WhatsApp](./docs/whatsapp-setup.md)
- [README Principal](./README.md)
