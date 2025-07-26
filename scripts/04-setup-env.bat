@echo off
echo 🚀 Configurando arquivo .env.local...

echo # Database URL - Substitua pela sua URL do Neon ou PostgreSQL local > .env.local
echo DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/conexao_unk_db?sslmode=require" >> .env.local
echo. >> .env.local
echo # Next.js configuration >> .env.local
echo NEXTAUTH_SECRET="conexao-unk-secret-key-2024" >> .env.local
echo NEXTAUTH_URL="http://localhost:3001" >> .env.local

echo ✅ Arquivo .env.local criado!
echo.
echo 📝 Agora você precisa:
echo 1. Editar o arquivo .env.local
echo 2. Substituir a DATABASE_URL pela sua URL do Neon
echo 3. Executar: npx prisma migrate dev --name init
echo 4. Executar: node scripts/03-setup-database.js
echo.
pause 