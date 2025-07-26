# 🌐 Configuração do Neon (PostgreSQL na Nuvem)

## 🚀 Passo a Passo Visual

### **1. Acessar Neon**
- Abra: https://neon.tech
- Clique em "Get Started"

### **2. Criar Conta**
- Use seu email
- Crie uma senha
- Confirme sua conta

### **3. Criar Projeto**
- Nome: `conexao-unk`
- Região: `São Paulo` (mais próxima)
- Clique em "Create Project"

### **4. Obter URL de Conexão**
Após criar o projeto, você verá algo como:
```
postgresql://user:password@ep-xxx-xxx-xxx.region.aws.neon.tech/conexao_unk_db?sslmode=require
```

### **5. Configurar .env.local**
Edite o arquivo `.env.local` e substitua:
```env
DATABASE_URL="sua_url_do_neon_aqui"
```

## 🔧 Configuração Rápida

### **1. Executar Migrações**
```bash
npx prisma migrate dev --name init
```

### **2. Inserir Dados de Exemplo**
```bash
node scripts/03-setup-database.js
```

### **3. Testar Sistema**
```bash
pnpm dev
```
Acesse: http://localhost:3001

## 🎯 Credenciais de Teste
- **Email**: `teste@email.com`
- **Senha**: `123456`

## ✅ Vantagens do Neon
- ✅ **Gratuito** para desenvolvimento
- ✅ **Sem instalação** local
- ✅ **Backup automático**
- ✅ **Escalável**
- ✅ **Interface web** para gerenciar dados

## 🔍 Troubleshooting

### **Erro de Conexão**
- Verifique se a URL está correta
- Confirme se o projeto está ativo
- Teste a conexão no painel do Neon

### **Erro de Migração**
```bash
# Resetar migrações
npx prisma migrate reset

# Recriar migração
npx prisma migrate dev --name init
```

### **Erro de Dados**
```bash
# Recriar dados de exemplo
node scripts/03-setup-database.js
```

## 📊 Próximos Passos

### **1. Testar Login**
- Acesse: http://localhost:3001
- Use: `teste@email.com` / `123456`

### **2. Testar Documentos**
- Vá para Projetos
- Clique em "Ver Documentos"
- Teste upload de arquivos

### **3. Prisma Studio**
```bash
npx prisma studio
```
Acesse: http://localhost:5555

---

**🎉 Com Neon, você tem PostgreSQL sem instalação!** 