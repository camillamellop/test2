@echo off
echo 🚀 Configuração Completa do Conexão UNK
echo ========================================
echo.

echo 📋 Verificando dependências...
call pnpm install
echo.

echo 🔧 Gerando cliente Prisma...
call npx prisma generate
echo.

echo 📊 Executando migrações...
call npx prisma migrate dev --name init
echo.

echo 📝 Inserindo dados de exemplo...
call node scripts/03-setup-database.js
echo.

echo 🔍 Testando conexão...
call node scripts/05-test-connection.js
echo.

echo 🎉 Configuração concluída!
echo.
echo 📱 Para acessar o sistema:
echo    URL: http://localhost:3001
echo    Email: teste@email.com
echo    Senha: 123456
echo.
echo 🛠️ Para gerenciar dados:
echo    npx prisma studio
echo.
pause 