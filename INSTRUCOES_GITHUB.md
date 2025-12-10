# Instruções para Enviar o Projeto para o GitHub

## Passo 1: Criar Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Configure o repositório:
   - **Repository name:** `api-emprestimos-angar`
   - **Description:** "API para integração com sistemas parceiros - Empréstimos Angar"
   - **Visibility:** **Private** (recomendado para projetos comerciais)
   - **NÃO** marque "Initialize this repository with a README"
5. Clique em **"Create repository"**

## Passo 2: Enviar o Código para o GitHub

Após criar o repositório, o GitHub mostrará instruções. Use os comandos abaixo:

### Se você ainda não tem o GitHub CLI instalado:

```bash
# Adicionar o repositório remoto (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/api-emprestimos-angar.git

# Enviar o código
git push -u origin main
```

### Se você tem o GitHub CLI instalado:

```bash
# Criar repositório e fazer push automaticamente
gh repo create api-emprestimos-angar --private --source=. --push
```

## Passo 3: Verificar o Envio

1. Acesse `https://github.com/SEU_USUARIO/api-emprestimos-angar`
2. Verifique se todos os arquivos foram enviados
3. Confirme que o arquivo `.env` **NÃO** está no repositório (ele está no .gitignore)

## Passo 4: Configurar Secrets do GitHub (Opcional)

Se você for usar GitHub Actions no futuro:

1. No repositório, vá para **Settings > Secrets and variables > Actions**
2. Clique em **"New repository secret"**
3. Adicione os secrets necessários:
   - `JWT_SECRET`
   - `KEY_ANGAR`
   - `WHATSAPP_ACCESS_TOKEN`
   - etc.

## Comandos Git Úteis

```bash
# Ver status do repositório
git status

# Adicionar novos arquivos
git add .

# Fazer commit das mudanças
git commit -m "Descrição das mudanças"

# Enviar para o GitHub
git push

# Ver histórico de commits
git log --oneline

# Criar uma nova branch
git checkout -b nome-da-branch

# Voltar para a branch main
git checkout main
```

## Estrutura de Branches Recomendada

Para facilitar o deploy em múltiplos ambientes:

```
main (produção)
  ↑
develop (homologação)
  ↑
feature/nome-da-feature (desenvolvimento)
```

### Criar branch de desenvolvimento:

```bash
git checkout -b develop
git push -u origin develop
```

### Workflow recomendado:

1. Desenvolva em branches `feature/*`
2. Merge para `develop` → Deploy automático em homologação
3. Após testes, merge para `main` → Deploy automático em produção

## Próximo Passo

Após enviar o código para o GitHub, siga o guia em `docs/deploy-render.md` para fazer o deploy no Render.
