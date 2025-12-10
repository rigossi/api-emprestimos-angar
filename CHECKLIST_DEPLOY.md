# Checklist de Deploy - API de Empréstimos Angar

Use este checklist para garantir que todos os passos foram executados corretamente.

## ☐ Fase 1: Preparação do Código

- [x] Código do projeto criado e testado localmente
- [x] Repositório Git inicializado
- [x] Arquivo `.gitignore` configurado
- [x] Arquivo `.env.example` criado (sem dados sensíveis)
- [x] Documentação OpenAPI criada
- [ ] Código enviado para o GitHub

## ☐ Fase 2: Configuração do GitHub

- [ ] Repositório criado no GitHub (private)
- [ ] Código enviado via `git push`
- [ ] Verificado que `.env` não foi commitado
- [ ] Branch `main` configurada como padrão
- [ ] (Opcional) Branch `develop` criada para homologação

## ☐ Fase 3: Deploy em Homologação

### Render - Configuração Inicial
- [ ] Conta criada no Render
- [ ] Conta do GitHub conectada ao Render
- [ ] Repositório conectado ao Render

### Render - Ambiente de Homologação
- [ ] Web Service criado: `api-angar-homologacao`
- [ ] Runtime: Node
- [ ] Branch: `main` ou `develop`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Health Check Path: `/health`
- [ ] Plan: Free

### Variáveis de Ambiente - Homologação
- [ ] `NODE_ENV` = `staging`
- [ ] `PORT` = `3000`
- [ ] `JWT_SECRET` = [gerado]
- [ ] `JWT_EXPIRES_IN` = `3600`
- [ ] `KEY_ANGAR` = [gerado]
- [ ] `APP_BASE_URL` = `https://api-angar-homologacao.onrender.com`
- [ ] `WHATSAPP_API_URL` = `https://graph.facebook.com/v18.0`
- [ ] `WHATSAPP_PHONE_NUMBER_ID` = [configurar]
- [ ] `WHATSAPP_ACCESS_TOKEN` = [configurar]
- [ ] `WHATSAPP_TEMPLATE_NAME` = `proposta_emprestimo_confirmacao`

### Testes - Homologação
- [ ] Deploy concluído com sucesso
- [ ] Health check respondendo: `/health`
- [ ] Endpoint de login funcionando: `POST /v1/login`
- [ ] Autenticação JWT funcionando
- [ ] Endpoint de propostas funcionando: `POST /v1/propostas`
- [ ] Logs verificados (sem erros críticos)

## ☐ Fase 4: Configuração do WhatsApp Business

- [ ] Conta Meta Business criada
- [ ] Aplicativo criado no Meta Developers
- [ ] Produto WhatsApp adicionado
- [ ] Número de telefone verificado
- [ ] Message Template criado
- [ ] Message Template aprovado pela Meta
- [ ] Token de acesso permanente gerado
- [ ] Phone Number ID copiado
- [ ] Variáveis configuradas no Render

### Teste de Integração WhatsApp
- [ ] Mensagem de teste enviada com sucesso
- [ ] Mensagem recebida no WhatsApp
- [ ] Template renderizado corretamente

## ☐ Fase 5: Deploy em Produção

### Render - Ambiente de Produção
- [ ] Web Service criado: `api-angar-producao`
- [ ] Runtime: Node
- [ ] Branch: `main`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Health Check Path: `/health`
- [ ] Plan: Starter ou superior

### Variáveis de Ambiente - Produção
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`
- [ ] `JWT_SECRET` = [DIFERENTE de homologação]
- [ ] `JWT_EXPIRES_IN` = `3600`
- [ ] `KEY_ANGAR` = [DIFERENTE de homologação]
- [ ] `APP_BASE_URL` = `https://api-angar-producao.onrender.com`
- [ ] `WHATSAPP_API_URL` = `https://graph.facebook.com/v18.0`
- [ ] `WHATSAPP_PHONE_NUMBER_ID` = [configurar]
- [ ] `WHATSAPP_ACCESS_TOKEN` = [configurar]
- [ ] `WHATSAPP_TEMPLATE_NAME` = `proposta_emprestimo_confirmacao`

### Testes - Produção
- [ ] Deploy concluído com sucesso
- [ ] Health check respondendo: `/health`
- [ ] Endpoint de login funcionando: `POST /v1/login`
- [ ] Autenticação JWT funcionando
- [ ] Endpoint de propostas funcionando: `POST /v1/propostas`
- [ ] WhatsApp enviando mensagens corretamente
- [ ] Logs verificados (sem erros críticos)

## ☐ Fase 6: Configuração de Webhooks

### Webhook de Teste (Homologação)
- [ ] Conta criada no webhook.site ou similar
- [ ] URL de teste configurada em proposta de teste
- [ ] Webhook recebido com sucesso
- [ ] Assinatura HMAC verificada
- [ ] Payload correto recebido

### Webhook de Produção
- [ ] URL do webhook do parceiro obtida
- [ ] `key_angar` compartilhada com o parceiro de forma segura
- [ ] Documentação de verificação de assinatura enviada ao parceiro
- [ ] Teste end-to-end realizado com sucesso

## ☐ Fase 7: Segurança e Monitoramento

### Segurança
- [ ] Todas as variáveis sensíveis estão no Render (não no código)
- [ ] Arquivo `.env` não está no repositório
- [ ] HTTPS ativo em todos os ambientes
- [ ] Tokens JWT com expiração configurada
- [ ] Rate limiting considerado (para futuro)

### Monitoramento
- [ ] Logs do Render configurados
- [ ] Alertas de deploy failure configurados
- [ ] Alertas de service down configurados
- [ ] Health check monitorado

## ☐ Fase 8: Documentação para Parceiros

### Documentação Técnica
- [ ] URL da API de homologação documentada
- [ ] URL da API de produção documentada
- [ ] Credenciais de teste fornecidas (homologação)
- [ ] Credenciais de produção geradas
- [ ] Documentação OpenAPI compartilhada
- [ ] Guia de integração criado
- [ ] Exemplos de requisições fornecidos
- [ ] Documentação de webhook fornecida
- [ ] `key_angar` compartilhada de forma segura

### Credenciais de Acesso
- [ ] Client ID gerado para o parceiro
- [ ] Client Secret gerado para o parceiro
- [ ] Credenciais adicionadas ao sistema (model)
- [ ] Credenciais testadas

## ☐ Fase 9: Testes End-to-End

### Fluxo Completo - Homologação
- [ ] Parceiro faz login
- [ ] Parceiro envia proposta
- [ ] WhatsApp envia mensagem ao cliente
- [ ] Cliente recebe mensagem
- [ ] Cliente aceita/recusa proposta
- [ ] Webhook notifica o parceiro
- [ ] Parceiro recebe notificação corretamente

### Fluxo Completo - Produção
- [ ] Mesmo fluxo testado em produção
- [ ] Performance aceitável
- [ ] Sem erros nos logs

## ☐ Fase 10: Go Live

- [ ] Todos os testes passaram
- [ ] Documentação entregue ao parceiro
- [ ] Parceiro confirmou recebimento
- [ ] Suporte técnico preparado
- [ ] Plano de rollback definido
- [ ] Backup das configurações realizado

## URLs dos Ambientes

### Homologação
- Base URL: `https://api-angar-homologacao.onrender.com`
- Health Check: `https://api-angar-homologacao.onrender.com/health`
- Login: `https://api-angar-homologacao.onrender.com/v1/login`
- Propostas: `https://api-angar-homologacao.onrender.com/v1/propostas`

### Produção
- Base URL: `https://api-angar-producao.onrender.com`
- Health Check: `https://api-angar-producao.onrender.com/health`
- Login: `https://api-angar-producao.onrender.com/v1/login`
- Propostas: `https://api-angar-producao.onrender.com/v1/propostas`

## Contatos de Suporte

- **Render Status:** https://status.render.com
- **Render Docs:** https://docs.render.com
- **Meta WhatsApp Docs:** https://developers.facebook.com/docs/whatsapp
- **Suporte Interno:** dev@angar.com.br

## Notas Importantes

⚠️ **Nunca commite arquivos `.env` no Git**
⚠️ **Use secrets diferentes para cada ambiente**
⚠️ **Teste sempre em homologação antes de produção**
⚠️ **Mantenha backup das variáveis de ambiente**
⚠️ **Documente todas as mudanças**
