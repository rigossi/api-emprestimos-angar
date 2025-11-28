# Guia de Deploy no Render

Este documento detalha o processo completo para fazer deploy da API de Empréstimos Angar no Render com ambientes separados de homologação e produção.

## Pré-requisitos

1. Conta no [Render](https://render.com) (gratuita)
2. Conta no GitHub ou GitLab
3. Código do projeto em um repositório Git

## Passo 1: Preparar o Repositório Git

### 1.1. Inicializar Git (se ainda não foi feito)

```bash
cd api-emprestimos-angar
git init
git add .
git commit -m "Initial commit: API de Empréstimos Angar"
```

### 1.2. Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"**
3. Nome: `api-emprestimos-angar`
4. Visibilidade: **Private** (recomendado)
5. Clique em **"Create repository"**

### 1.3. Enviar Código para o GitHub

```bash
git remote add origin https://github.com/SEU_USUARIO/api-emprestimos-angar.git
git branch -M main
git push -u origin main
```

## Passo 2: Configurar Render

### 2.1. Criar Conta no Render

1. Acesse [render.com](https://render.com)
2. Clique em **"Get Started"**
3. Faça login com sua conta do GitHub

### 2.2. Conectar Repositório

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte sua conta do GitHub
4. Selecione o repositório `api-emprestimos-angar`

## Passo 3: Deploy do Ambiente de Homologação

### 3.1. Configurações Básicas

- **Name:** `api-angar-homologacao`
- **Region:** Oregon (US West)
- **Branch:** `main` (ou `develop` se preferir)
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 3.2. Configurar Variáveis de Ambiente

Clique em **"Advanced"** e adicione as seguintes variáveis:

| Chave | Valor | Observação |
|-------|-------|------------|
| `NODE_ENV` | `staging` | Ambiente de homologação |
| `PORT` | `3000` | Porta padrão |
| `JWT_SECRET` | `[gerar aleatório]` | Use o gerador do Render |
| `JWT_EXPIRES_IN` | `3600` | 1 hora |
| `KEY_ANGAR` | `[gerar aleatório]` | Use o gerador do Render |
| `APP_BASE_URL` | `https://api-angar-homologacao.onrender.com` | Será a URL gerada |
| `WHATSAPP_API_URL` | `https://graph.facebook.com/v18.0` | API do WhatsApp |
| `WHATSAPP_PHONE_NUMBER_ID` | `[seu phone number id]` | Do WhatsApp Business |
| `WHATSAPP_ACCESS_TOKEN` | `[seu token]` | Token permanente do WhatsApp |
| `WHATSAPP_TEMPLATE_NAME` | `proposta_emprestimo_confirmacao` | Nome do template |

### 3.3. Configurar Health Check

- **Health Check Path:** `/health`

### 3.4. Selecionar Plano

- **Plan:** Free (para homologação)
- O plano free tem algumas limitações:
  - Servidor hiberna após 15 minutos de inatividade
  - 750 horas/mês gratuitas
  - Ideal para testes

### 3.5. Criar Web Service

Clique em **"Create Web Service"**

O Render iniciará o deploy automaticamente. Aguarde alguns minutos.

## Passo 4: Deploy do Ambiente de Produção

Repita o processo acima com as seguintes diferenças:

### 4.1. Configurações Básicas

- **Name:** `api-angar-producao`
- **Branch:** `main` (ou crie uma branch `production`)

### 4.2. Variáveis de Ambiente

**Importante:** Use valores DIFERENTES para produção:

| Chave | Valor | Observação |
|-------|-------|------------|
| `NODE_ENV` | `production` | ⚠️ Ambiente de produção |
| `JWT_SECRET` | `[DIFERENTE da homologação]` | ⚠️ Gere um novo |
| `KEY_ANGAR` | `[DIFERENTE da homologação]` | ⚠️ Gere um novo |
| `APP_BASE_URL` | `https://api-angar-producao.onrender.com` | URL de produção |

### 4.3. Selecionar Plano

- **Plan:** Starter ($7/mês) ou superior
- Vantagens:
  - Servidor sempre ativo (sem hibernação)
  - Melhor performance
  - Mais recursos

## Passo 5: Configurar Domínio Customizado (Opcional)

### 5.1. Adicionar Domínio

1. No dashboard do serviço, vá para **"Settings"**
2. Role até **"Custom Domain"**
3. Clique em **"Add Custom Domain"**
4. Digite seu domínio (ex: `api.angar.com.br`)

### 5.2. Configurar DNS

Adicione um registro CNAME no seu provedor de DNS:

```
Tipo: CNAME
Nome: api (ou api-homologacao / api-producao)
Valor: [fornecido pelo Render]
```

O Render configurará automaticamente o certificado SSL.

## Passo 6: Testar os Ambientes

### 6.1. Testar Health Check

**Homologação:**
```bash
curl https://api-angar-homologacao.onrender.com/health
```

**Produção:**
```bash
curl https://api-angar-producao.onrender.com/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-28T15:39:07.588Z",
  "environment": "staging" // ou "production"
}
```

### 6.2. Testar Autenticação

```bash
curl -X POST https://api-angar-homologacao.onrender.com/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "parceiro_abc_123",
    "client_secret": "dK$!s#@j9sA*d(s@D*j"
  }'
```

## Passo 7: Configurar Deploy Automático

O Render já está configurado para fazer deploy automático quando você fizer push para o repositório.

### 7.1. Deploy Manual

Se precisar fazer deploy manual:

1. Acesse o dashboard do serviço
2. Clique em **"Manual Deploy"**
3. Selecione **"Deploy latest commit"**

### 7.2. Rollback

Para voltar a uma versão anterior:

1. Acesse **"Events"** no dashboard
2. Encontre o deploy desejado
3. Clique em **"Rollback to this version"**

## Passo 8: Monitoramento e Logs

### 8.1. Visualizar Logs

1. No dashboard do serviço, clique em **"Logs"**
2. Os logs são atualizados em tempo real

### 8.2. Configurar Alertas

1. Vá para **"Settings"**
2. Role até **"Notifications"**
3. Configure alertas por email para:
   - Deploy failures
   - Service down

## URLs dos Ambientes

Após o deploy, você terá:

### Homologação
- **URL Base:** `https://api-angar-homologacao.onrender.com`
- **Health Check:** `https://api-angar-homologacao.onrender.com/health`
- **Login:** `https://api-angar-homologacao.onrender.com/v1/login`
- **Propostas:** `https://api-angar-homologacao.onrender.com/v1/propostas`

### Produção
- **URL Base:** `https://api-angar-producao.onrender.com`
- **Health Check:** `https://api-angar-producao.onrender.com/health`
- **Login:** `https://api-angar-producao.onrender.com/v1/login`
- **Propostas:** `https://api-angar-producao.onrender.com/v1/propostas`

## Boas Práticas

### 1. Separação de Branches

Considere usar:
- `develop` → Deploy automático para homologação
- `main` → Deploy automático para produção

### 2. Variáveis de Ambiente

- **NUNCA** commite o arquivo `.env` no Git
- Use o gerenciador de variáveis do Render
- Mantenha backups seguros das variáveis de produção

### 3. Secrets

- Gere `JWT_SECRET` e `KEY_ANGAR` diferentes para cada ambiente
- Use o gerador de valores aleatórios do Render
- Armazene os valores em um gerenciador de senhas

### 4. Testes

- Sempre teste em homologação antes de fazer deploy em produção
- Use credenciais de teste do WhatsApp em homologação
- Configure webhooks de teste (webhook.site) em homologação

## Troubleshooting

### Erro: "Build failed"

1. Verifique os logs de build
2. Confirme que todas as dependências estão no `package.json`
3. Verifique se o Node.js version está especificado

### Erro: "Application failed to respond"

1. Verifique se a porta está configurada corretamente (`PORT=3000`)
2. Confirme que o servidor está escutando em `0.0.0.0` e não em `localhost`
3. Verifique os logs da aplicação

### Servidor hiberna (Free tier)

- É normal no plano free
- Primeira requisição pode demorar 30-60 segundos
- Para produção, use plano pago

## Custos Estimados

### Homologação
- **Free tier:** $0/mês
- Limitações: Hibernação após 15 min de inatividade

### Produção
- **Starter:** $7/mês
- **Standard:** $25/mês (mais recursos)
- **Pro:** $85/mês (alta performance)

## Próximos Passos

1. ✅ Fazer deploy em homologação
2. ✅ Testar todos os endpoints
3. ✅ Configurar WhatsApp Business API
4. ✅ Testar webhooks
5. ✅ Fazer deploy em produção
6. ✅ Documentar URLs para parceiros
7. ✅ Criar credenciais de acesso para parceiros

## Suporte

- **Documentação Render:** [docs.render.com](https://docs.render.com)
- **Status do Render:** [status.render.com](https://status.render.com)
- **Suporte:** [render.com/support](https://render.com/support)
