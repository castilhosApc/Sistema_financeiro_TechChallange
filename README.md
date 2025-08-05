# 💰 Sistema Bancário - FIAP

Um sistema completo de gestão financeira desenvolvido com Next.js 15, Prisma e Tailwind CSS.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React com SSR/SSG
- **React 18** - Biblioteca de interface
- **Tailwind CSS** - Framework de styling
- **TypeScript** - Tipagem estática

### Backend
- **Node.js** - Runtime JavaScript
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados local
- **bcryptjs** - Criptografia de senhas

### Autenticação
- **Sessões seguras** com tokens únicos
- **Cookies httpOnly** para proteção
- **Criptografia** de senhas com bcrypt

## 📋 Funcionalidades

### 🔐 Autenticação
- ✅ Login com email e senha
- ✅ Cadastro de novos usuários
- ✅ Logout seguro
- ✅ Persistência de sessão (30 dias)

### 💳 Transações
- ✅ Criar, editar e excluir transações
- ✅ Categorização (Receitas/Despesas)
- ✅ Histórico completo
- ✅ Saldo em tempo real

### 👥 Contatos
- ✅ Cadastro de contatos com PIX
- ✅ Busca inteligente por nome/PIX/email
- ✅ Informações bancárias completas
- ✅ Integração com transações

### 🏦 Sistema PIX
- ✅ Busca por chave PIX
- ✅ Cadastro automático de contatos
- ✅ Suporte a diferentes tipos de chave
- ✅ Informações bancárias

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd projeto-fiap
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
```bash
# Execute o setup automático
npm run setup-db

# Ou manualmente:
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

### 5. Acesse o sistema
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 👤 Credenciais de Teste

### Usuário Admin
- **Email:** `admin@admin.com`
- **Senha:** `admin@123`

## 📁 Estrutura do Projeto

```
projeto-fiap/
├── app/
│   ├── actions/           # Server Actions
│   │   ├── auth.js       # Autenticação
│   │   ├── contacts.js   # CRUD contatos
│   │   ├── transactions.js # CRUD transações
│   │   └── user.js       # Dados do usuário
│   ├── components/        # Componentes React
│   │   ├── auth/         # Formulários de auth
│   │   ├── layout/       # Header, etc.
│   │   ├── transactions/ # Componentes de transações
│   │   └── ui/           # Componentes reutilizáveis
│   ├── lib/              # Configurações
│   │   └── database.js   # Cliente Prisma
│   └── page.tsx          # Página principal
├── prisma/
│   ├── schema.prisma     # Schema do banco
│   ├── seed.js          # Dados iniciais
│   └── migrations/      # Migrações
├── public/              # Arquivos estáticos
└── package.json         # Dependências
```

## 🗄️ Banco de Dados

### Modelos
- **User**: Usuários do sistema
- **Session**: Sessões de autenticação
- **Transaction**: Transações financeiras
- **Contact**: Contatos com PIX

### Configuração
- **Database**: SQLite (local)
- **ORM**: Prisma
- **Migrations**: Automáticas

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção

# Banco de dados
npm run setup-db     # Setup completo do banco
npm run db:generate  # Gera cliente Prisma
npm run db:migrate   # Executa migrações
npm run db:seed      # Popula banco com dados
npm run db:studio    # Abre Prisma Studio
npm run db:reset     # Reseta banco de dados

# Outros
npm run lint         # Executa ESLint
```

## 🌐 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Plataformas
- **Netlify**: Suporte completo
- **Railway**: Deploy fácil
- **Heroku**: Configuração manual

## 🔒 Segurança

### Implementado
- ✅ Senhas criptografadas (bcrypt)
- ✅ Sessões seguras com tokens
- ✅ Cookies httpOnly
- ✅ Validação de dados
- ✅ Proteção contra SQL Injection (Prisma)

### Recomendações
- Use HTTPS em produção
- Configure rate limiting
- Implemente logs de auditoria
- Adicione 2FA para produção

## 📱 Responsividade

O sistema é totalmente responsivo:
- ✅ **Desktop**: Layout completo
- ✅ **Tablet**: Adaptação automática
- ✅ **Mobile**: Interface otimizada

## 🎨 Interface

### Design System
- **Cores**: Gradientes modernos
- **Tipografia**: Inter (Google Fonts)
- **Componentes**: Reutilizáveis
- **Animações**: Transições suaves

### Tema
- ✅ **Modo Claro**: Padrão
- ✅ **Modo Escuro**: Automático
- ✅ **Transições**: Suaves

## 🧪 Testes

### Funcionalidades Testadas
- ✅ Login/Logout
- ✅ CRUD Transações
- ✅ CRUD Contatos
- ✅ Busca por PIX
- ✅ Responsividade
- ✅ Validações

## 📈 Performance

### Otimizações
- ✅ **SSR**: Renderização no servidor
- ✅ **Code Splitting**: Automático
- ✅ **Image Optimization**: Next.js
- ✅ **Caching**: Estratégias implementadas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais na **FIAP**.

## 👨‍💻 Autor

**Nome do Aluno** - FIAP
- **Email**: aluno@fiap.com.br
- **GitHub**: [@usuario](https://github.com/usuario)

## 🙏 Agradecimentos

- **FIAP** - Instituição de ensino
- **Next.js** - Framework incrível
- **Prisma** - ORM moderno
- **Tailwind CSS** - Framework de styling

---

**Desenvolvido com ❤️ para a disciplina de Desenvolvimento Web - FIAP**
