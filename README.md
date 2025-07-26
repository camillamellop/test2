# Conexão Unk - Plataforma de Gestão

Uma plataforma completa de gestão desenvolvida com Next.js, TypeScript e Prisma, oferecendo funcionalidades avançadas para administração de eventos, finanças e recursos.

## 🚀 Funcionalidades

### 📅 Gestão de Eventos
- Calendário interativo com visualização de eventos
- Criação e edição de eventos
- Sistema de feriados nacionais
- Interface intuitiva para agendamento

### 💰 Gestão Financeira
- Controle completo de receitas e despesas
- Categorização de transações
- Despesas fixas com lembretes
- Gestão de dívidas e financiamentos
- Relatórios e dashboards financeiros
- Sistema de atribuição de receitas (Admin/DJ)

### 📱 Interface Moderna
- Design responsivo e moderno
- Tema escuro com elementos glassmorphism
- Navegação intuitiva
- Componentes reutilizáveis

### 🔐 Sistema de Autenticação
- Login seguro com Prisma
- Controle de acesso baseado em roles
- Proteção de rotas

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/conexao-unk-platform.git
cd conexao-unk-platform
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

4. **Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
```

5. **Execute o projeto**
```bash
npm run dev
```

## 🔧 Configuração do Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis:

```env
DATABASE_URL="sua_url_do_banco_de_dados"
NEXTAUTH_SECRET="seu_secret_key"
NEXTAUTH_URL="http://localhost:3000"
```

## 📁 Estrutura do Projeto

```
conexao-unk-platform/
├── app/                    # App Router (Next.js 14)
├── components/             # Componentes React
├── contexts/              # Contextos React
├── lib/                   # Utilitários e configurações
├── prisma/                # Schema e migrações do banco
├── public/                # Arquivos estáticos
└── styles/                # Estilos globais
```

## 🎯 Principais Componentes

- **CalendarPage**: Calendário interativo com eventos
- **FinancePage**: Gestão financeira completa
- **EventSheet**: Modal para criação/edição de eventos
- **TransactionSheet**: Modal para transações financeiras
- **TopHeader**: Header principal da aplicação
- **BottomNavigation**: Navegação inferior

## 🔄 Scripts Disponíveis

- `npm run dev` - Executa o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa o servidor de produção
- `npm run lint` - Executa o linter
- `npm run type-check` - Verifica tipos TypeScript

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Seu Nome** - *Desenvolvimento inicial* - [SeuGitHub](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- Comunidade Next.js
- Shadcn/ui por componentes incríveis
- Prisma por uma ORM excelente 