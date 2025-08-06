# 💰 Sistema Bancário - FIAP

Sistema completo de gestão financeira desenvolvido com **Next.js 15**, **Prisma** e **Tailwind CSS**. Permite gerenciar transações, contatos com PIX e autenticação de usuários.

## 🚀 Tecnologias

- **Next.js 15** - SSR/SSG
- **React 18** - Interface
- **Prisma** - ORM
- **SQLite** - Banco local
- **Tailwind CSS** - Styling

## 📋 Funcionalidades

- ✅ **Autenticação** - Login, cadastro e sessão persistente
- ✅ **Transações** - Criar, editar, excluir com categorização
- ✅ **Contatos PIX** - Cadastro com busca inteligente
- ✅ **Saldo em tempo real** - Receitas e despesas
- ✅ **Responsivo** - Desktop, tablet e mobile

## 🛠️ Instalação

### 1. Clone e instale
```bash
git clone https://github.com/castilhosApc/Sistema_financeiro_TechChallange/
npm install
```

### 2. Configure o banco
```bash
npm run setup-db
```

### 3. Execute
```bash
npm run dev
```

### 4. Acesse
Abra [http://localhost:3000](http://localhost:3000)

## 👤 Login de Teste

- **Email:** `admin@admin.com`
- **Senha:** `admin@123`

## 📁 Estrutura Principal

```
projeto-fiap/
├── app/
│   ├── actions/           # Server Actions
│   ├── components/        # Componentes React
│   └── page.tsx          # Página principal
├── prisma/
│   ├── schema.prisma     # Schema do banco
│   └── seed.js          # Dados iniciais
└── package.json
```

## 🔧 Scripts Úteis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run setup-db     # Setup banco
npm run db:studio    # Visualizar banco
```

## 🌐 Deploy

**Vercel (Recomendado):**
1. Conecte o repositório ao Vercel
2. Deploy automático

## 🔒 Segurança

- Senhas criptografadas (bcrypt)
- Sessões seguras com tokens
- Validação de dados
- Proteção contra SQL Injection

---

**Desenvolvido para a disciplina de Desenvolvimento Web - FIAP**
