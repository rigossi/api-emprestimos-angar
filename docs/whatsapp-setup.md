# Guia de Configuração do WhatsApp Business API

Este documento detalha o processo completo para configurar a API do WhatsApp Business (Cloud API) da Meta para uso com a API de Empréstimos Angar.

## Pré-requisitos

- Uma conta no Facebook
- Uma conta no Gerenciador de Negócios da Meta (Business Manager)
- Um número de telefone que **não esteja** vinculado a uma conta do WhatsApp (pessoal ou business)
- Pode ser um número de celular novo ou um telefone fixo capaz de receber chamadas ou SMS

## Processo de Configuração

### 1. Acessar o Portal de Desenvolvedores da Meta

1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Faça login com sua conta do Facebook
3. Clique em **"Meus aplicativos"**

### 2. Criar um Novo Aplicativo

1. Clique no botão **"Criar aplicativo"**
2. Selecione o tipo de aplicativo: **"Business"**
3. Dê um nome ao aplicativo (ex: "API de Empréstimos Angar")
4. Associe-o à sua conta do Gerenciador de Negócios

### 3. Configurar o Produto "WhatsApp"

1. Na tela do aplicativo, role para baixo e encontre o produto **"WhatsApp"**
2. Clique em **"Configurar"**
3. A Meta criará automaticamente:
   - Um número de telefone de teste
   - Um token de acesso temporário (válido por 24 horas)
4. Estes recursos são ótimos para desenvolvimento inicial

### 4. Adicionar e Verificar o Número de Telefone Oficial

1. No painel do WhatsApp, vá para a seção **"Configuração da API"**
2. Clique no botão **"Adicionar número de telefone"**
3. Preencha as informações do seu negócio e avance
4. Insira o número de telefone que será usado pela API
5. Escolha o método de verificação:
   - SMS
   - Chamada de voz
6. Insira o código recebido para verificar o número

### 5. Criar Modelos de Mensagem (Message Templates)

A API do WhatsApp Business **não permite** o envio de mensagens de formato livre para iniciar uma conversa. A primeira mensagem deve ser um "Modelo de Mensagem" pré-aprovado pela Meta.

#### Como criar um modelo:

1. Acesse: **Gerenciador de Negócios > Gerenciador do WhatsApp > Modelos de mensagem**
2. Clique em **"Criar modelo"**
3. Configure o modelo:

**Categoria:** Transacional (ex: "Atualização de conta")

**Nome:** `proposta_emprestimo_confirmacao`

**Idioma:** Português (Brasil)

**Conteúdo do Corpo:**
```
Olá, {{1}}. Recebemos uma proposta de empréstimo no valor de {{2}} para você. Para confirmar e ver os detalhes, por favor, acesse o link: {{3}}
```

**Variáveis:**
- `{{1}}` = Nome do cliente
- `{{2}}` = Valor do empréstimo formatado
- `{{3}}` = Link de confirmação

4. Envie o modelo para aprovação
5. O tempo de aprovação geralmente é de alguns minutos a algumas horas

### 6. Obter o Token de Acesso Permanente

O token de acesso gerado inicialmente expira em 24 horas. Para produção, precisamos de um token permanente.

#### Passos:

1. Acesse o **Gerenciador de Negócios**
2. Vá para **Usuários > Usuários do sistema**
3. Clique em **"Adicionar"** para criar um novo usuário do sistema
4. Dê um nome (ex: "API Angar System User")
5. Atribua a função de **"Admin"** ao usuário
6. Clique em **"Gerar novo token"**
7. Selecione o aplicativo criado anteriormente
8. Marque as permissões necessárias:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
9. Defina a expiração como **"Nunca"**
10. Copie e guarde o token em local seguro (ele não será exibido novamente)

### 7. Obter o Phone Number ID

1. No painel do WhatsApp, vá para **"Configuração da API"**
2. Localize o número de telefone configurado
3. Copie o **Phone Number ID** (é um número longo, diferente do número de telefone real)

### 8. Configurar as Variáveis de Ambiente

Adicione as seguintes variáveis ao arquivo `.env` do projeto:

```env
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id_aqui
WHATSAPP_ACCESS_TOKEN=seu_token_permanente_aqui
WHATSAPP_TEMPLATE_NAME=proposta_emprestimo_confirmacao
```

## Testando a Configuração

### Teste com o número de teste da Meta:

1. No painel do WhatsApp, adicione números de teste
2. Use a ferramenta de teste integrada para enviar uma mensagem
3. Verifique se a mensagem foi recebida no WhatsApp

### Teste com a API:

Execute o seguinte comando cURL (substitua os valores):

```bash
curl -X POST \
  'https://graph.facebook.com/v18.0/SEU_PHONE_NUMBER_ID/messages' \
  -H 'Authorization: Bearer SEU_TOKEN_DE_ACESSO' \
  -H 'Content-Type: application/json' \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5511987654321",
    "type": "template",
    "template": {
      "name": "proposta_emprestimo_confirmacao",
      "language": {
        "code": "pt_BR"
      },
      "components": [
        {
          "type": "body",
          "parameters": [
            {"type": "text", "text": "João Silva"},
            {"type": "text", "text": "R$ 1.500,00"},
            {"type": "text", "text": "https://api.angar.com.br/confirmar/123"}
          ]
        }
      ]
    }
  }'
```

## Limitações e Considerações

### Limites de Taxa (Rate Limits):

- **Tier 1 (padrão):** 1.000 conversas únicas por dia
- **Tier 2:** 10.000 conversas únicas por dia
- **Tier 3:** 100.000 conversas únicas por dia
- Para aumentar o tier, é necessário ter um bom histórico de qualidade

### Qualidade da Conta:

A Meta monitora a qualidade das mensagens. Fatores que afetam:
- Taxa de bloqueio pelos usuários
- Taxa de relatórios de spam
- Taxa de entrega

### Custos:

- Conversas iniciadas pelo negócio têm custo
- Conversas iniciadas pelo usuário são gratuitas nas primeiras 24 horas
- Consulte a [tabela de preços da Meta](https://developers.facebook.com/docs/whatsapp/pricing)

## Solução de Problemas

### Erro: "Template not found"
- Verifique se o template foi aprovado
- Confirme o nome exato do template
- Verifique o código do idioma (pt_BR)

### Erro: "Invalid phone number"
- O número deve estar no formato E.164 (ex: 5511987654321)
- Não use espaços, parênteses ou traços

### Token expirado:
- Gere um novo token permanente seguindo o passo 6

## Recursos Adicionais

- [Documentação oficial da WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Guia de Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)
- [Referência da API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)

## Suporte

Para questões técnicas relacionadas à configuração do WhatsApp, entre em contato com o suporte da Meta ou consulte a documentação oficial.
