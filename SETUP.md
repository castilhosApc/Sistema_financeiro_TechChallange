# 🚀 Setup Rápido - Sistema Bancário FIAP

Guia rápido para configurar e executar o sistema bancário em menos de 5 minutos.

## ⚡ Setup Express

### 1. Clone e Instale
```bash
git clone <URL_DO_REPOSITORIO>
cd projeto-fiap
npm install
```

### 2. Configure o Banco
```bash
# Crie o arquivo .env
echo 'DATABASE_URL="file:./dev.db"' > .env

# Configure o banco
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 3. Execute
```bash
npm run dev
```

**Pronto!** Acesse: http://localhost:3000

## 🔧 Comandos Essenciais

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Cria build de produção |
| `npx prisma studio` | Abre interface do banco |
| `npx prisma db push` | Sincroniza schema do banco |
| `npx prisma db seed` | Popula dados de exemplo |

## 🚨 Problemas Comuns

### Porta Ocupada
```bash
# O Next.js usará automaticamente a próxima porta
# Verifique o terminal para a URL correta
```

### Erro de Banco
```bash
# Execute em sequência:
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Dependências
```bash
# Se houver problemas:
rm -rf node_modules package-lock.json
npm install
```

## 📊 Dados de Teste

O sistema vem com dados prontos:

- **Usuário**: João Silva (joao.silva@email.com)
- **Contatos**: Maria, Pedro, Ana
- **Transações**: Salário, Supermercado, Transferência, etc.

## 🎯 Funcionalidades para Testar

1. **Dashboard**: Visualize saldo e estatísticas
2. **Nova Transação**: Clique em "+ Nova Transação"
3. **Editar**: Clique em "Editar" em qualquer transação
4. **Excluir**: Clique em "Excluir" em qualquer transação
5. **Modo Noturno**: Toggle no cabeçalho

## 📱 URLs Importantes

- **Sistema**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (após `npx prisma studio`)
- **API Transações**: http://localhost:3000/api/transactions
- **API Contatos**: http://localhost:3000/api/contacts

---

**🎉 Sistema pronto para uso!** 