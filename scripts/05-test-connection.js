const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...')
    
    // Testar conexão básica
    await prisma.$connect()
    console.log('✅ Conexão estabelecida com sucesso!')
    
    // Testar query simples
    const userCount = await prisma.user.count()
    console.log(`📊 Usuários no banco: ${userCount}`)
    
    const projectCount = await prisma.project.count()
    console.log(`📋 Projetos no banco: ${projectCount}`)
    
    const documentCount = await prisma.document.count()
    console.log(`📁 Documentos no banco: ${documentCount}`)
    
    const instagramPhotoCount = await prisma.instagramPhoto.count()
    console.log(`📸 Fotos do Instagram no banco: ${instagramPhotoCount}`)
    
    console.log('\n🎉 Banco de dados funcionando perfeitamente!')
    console.log('📧 Login: teste@email.com')
    console.log('🔑 Senha: 123456')
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message)
    console.log('\n🔧 Soluções possíveis:')
    console.log('1. Verifique se a DATABASE_URL está correta no .env.local')
    console.log('2. Confirme se o banco está ativo (Neon)')
    console.log('3. Execute: npx prisma migrate dev --name init')
    console.log('4. Execute: node scripts/03-setup-database.js')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection() 