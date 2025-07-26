const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log('🚀 Configurando banco de dados...')

    // Criar usuários de teste
    const hashedPassword = await bcrypt.hash('123456', 10)
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'image.pngas le' },
      update: {},
      create: {
        email: 'admin@email.com',
        name: 'Administrador',
        password: hashedPassword,
        role: 'admin',
        bio: 'Administrador da plataforma Conexão UNK',
        phone: '(11) 99999-9999',
        location: 'São Paulo, SP',
        pixKey: 'admin@email.com',
        socialMedia: {
          instagram: '@conexao_unk',
          twitter: '@conexao_unk',
          website: 'https://conexao-unk.com'
        }
      },
    })

    const djUser = await prisma.user.upsert({
      where: { email: 'dj@email.com' },
      update: {},
      create: {
        email: 'dj@email.com',
        name: 'DJ Teste',
        password: hashedPassword,
        role: 'dj',
        bio: 'DJ profissional com experiência em diversos eventos',
        phone: '(11) 88888-8888',
        location: 'Rio de Janeiro, RJ',
        pixKey: 'dj@email.com',
        socialMedia: {
          instagram: '@dj_profissional',
          youtube: 'Canal do DJ'
        }
      },
    })

    console.log('✅ Admin criado:', adminUser.email)
    console.log('✅ DJ criado:', djUser.email)

    // Criar projetos de exemplo
    const projects = await Promise.all([
      prisma.project.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          title: 'Desenvolvimento de Branding',
          description: 'Criar identidade visual completa para carreira musical',
          category: 'branding',
          status: 'active',
          progress: 75,
          deadline: new Date('2024-12-31'),
          userId: adminUser.id,
        },
      }),
      prisma.project.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          title: 'Mixagem do Álbum',
          description: 'Finalizar mixagem das 12 faixas do álbum',
          category: 'dj-music',
          status: 'active',
          progress: 60,
          deadline: new Date('2024-11-15'),
          userId: adminUser.id,
        },
      }),
      prisma.project.upsert({
        where: { id: 3 },
        update: {},
        create: {
          id: 3,
          title: 'Gestão de Redes Sociais',
          description: 'Criar conteúdo para Instagram e TikTok',
          category: 'instagram',
          status: 'active',
          progress: 30,
          deadline: new Date('2024-12-15'),
          userId: adminUser.id,
        },
      }),
    ])

    console.log('✅ Projetos criados:', projects.length)

    // Criar tarefas de exemplo
    const tasks = await Promise.all([
      prisma.task.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          title: 'Criar logo',
          description: 'Design do logo principal',
          completed: true,
          priority: 'high',
          dueDate: new Date('2024-10-15'),
          projectId: 1,
        },
      }),
      prisma.task.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          title: 'Definir paleta de cores',
          description: 'Escolher cores da marca',
          completed: false,
          priority: 'medium',
          dueDate: new Date('2024-10-20'),
          projectId: 1,
        },
      }),
      prisma.task.upsert({
        where: { id: 3 },
        update: {},
        create: {
          id: 3,
          title: 'Mixar faixa 1',
          description: 'Finalizar mixagem da primeira faixa',
          completed: true,
          priority: 'high',
          dueDate: new Date('2024-10-25'),
          projectId: 2,
        },
      }),
      prisma.task.upsert({
        where: { id: 4 },
        update: {},
        create: {
          id: 4,
          title: 'Criar post semanal',
          description: 'Conteúdo para Instagram',
          completed: false,
          priority: 'medium',
          dueDate: new Date('2024-10-30'),
          projectId: 3,
        },
      }),
    ])

    console.log('✅ Tarefas criadas:', tasks.length)

    // Criar documentos de exemplo
    const documents = await Promise.all([
      prisma.document.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          title: 'Contrato de Show - Festa de Aniversário',
          description: 'Contrato para show de aniversário em 15/12/2024',
          fileName: 'contrato-show-aniversario.pdf',
          fileUrl: '/documents/contrato-show-aniversario.pdf',
          fileType: 'pdf',
          fileSize: 245760,
          category: 'contract',
          userId: adminUser.id,
        },
      }),
      prisma.document.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          title: 'Proposta Comercial - Evento Corporativo',
          description: 'Proposta para evento corporativo de fim de ano',
          fileName: 'proposta-evento-corporativo.docx',
          fileUrl: '/documents/proposta-evento-corporativo.docx',
          fileType: 'docx',
          fileSize: 512000,
          category: 'proposal',
          userId: adminUser.id,
        },
      }),
      prisma.document.upsert({
        where: { id: 3 },
        update: {},
        create: {
          id: 3,
          title: 'Fatura - Equipamentos de Som',
          description: 'Fatura dos equipamentos adquiridos em outubro',
          fileName: 'fatura-equipamentos.pdf',
          fileUrl: '/documents/fatura-equipamentos.pdf',
          fileType: 'pdf',
          fileSize: 102400,
          category: 'invoice',
          userId: adminUser.id,
        },
      }),
    ])

    console.log('✅ Documentos criados:', documents.length)

    // Criar transações financeiras de exemplo
    const transactions = await Promise.all([
      prisma.transaction.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          type: 'income',
          amount: 1500.00,
          description: 'Show de aniversário',
          category: 'shows',
          date: new Date('2024-10-15'),
          userId: adminUser.id,
          createdBy: adminUser.id,
        },
      }),
      prisma.transaction.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          type: 'expense',
          amount: 250.00,
          description: 'Equipamentos de som',
          category: 'equipment',
          date: new Date('2024-10-10'),
          userId: adminUser.id,
          createdBy: adminUser.id,
        },
      }),
      prisma.transaction.upsert({
        where: { id: 3 },
        update: {},
        create: {
          id: 3,
          type: 'income',
          amount: 800.00,
          description: 'DJ em festa corporativa',
          category: 'shows',
          date: new Date('2024-10-20'),
          userId: adminUser.id,
          createdBy: adminUser.id,
        },
      }),
    ])

    console.log('✅ Transações criadas:', transactions.length)

    // Criar notas de exemplo
    const notes = await Promise.all([
      prisma.note.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          title: 'Ideia para próxima música',
          content: 'Explorar ritmos africanos com elementos eletrônicos',
          type: 'idea',
          pinned: true,
          userId: adminUser.id,
        },
      }),
      prisma.note.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          title: 'Lembrete importante',
          content: 'Finalizar mixagem do álbum até sexta-feira',
          type: 'reminder',
          pinned: true,
          userId: adminUser.id,
        },
      }),
      prisma.note.upsert({
        where: { id: 3 },
        update: {},
        create: {
          id: 3,
          title: 'Inspiração para branding',
          content: 'Usar elementos da cultura brasileira no design',
          type: 'idea',
          pinned: false,
          userId: adminUser.id,
        },
      }),
    ])

    console.log('✅ Notas criadas:', notes.length)

    // Criar fotos do Instagram de exemplo
    const instagramPhotos = await Promise.all([
      prisma.instagramPhoto.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          title: 'Show de aniversário',
          description: 'Fotos do show de aniversário no sábado',
          fileName: 'show_aniversario_01.jpg',
          fileUrl: 'https://example.com/uploads/show_aniversario_01.jpg',
          fileSize: 2048576, // 2MB
          folder: 'posts',
          status: 'posted',
          postedDate: new Date('2024-10-15'),
          projectId: 3,
          userId: adminUser.id,
        },
      }),
      prisma.instagramPhoto.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          title: 'Backstage do evento',
          description: 'Momentos do backstage antes do show',
          fileName: 'backstage_evento_01.jpg',
          fileUrl: 'https://example.com/uploads/backstage_evento_01.jpg',
          fileSize: 1536000, // 1.5MB
          folder: 'stories',
          status: 'draft',
          projectId: 3,
          userId: adminUser.id,
        },
      }),
      prisma.instagramPhoto.upsert({
        where: { id: 3 },
        update: {},
        create: {
          id: 3,
          title: 'Reel do making of',
          description: 'Vídeo do making of do álbum',
          fileName: 'making_of_album.mp4',
          fileUrl: 'https://example.com/uploads/making_of_album.mp4',
          fileSize: 15728640, // 15MB
          folder: 'reels',
          status: 'scheduled',
          scheduledDate: new Date('2024-11-01T18:00:00'),
          projectId: 2,
          userId: adminUser.id,
        },
      }),
      prisma.instagramPhoto.upsert({
        where: { id: 4 },
        update: {},
        create: {
          id: 4,
          title: 'Highlight do álbum',
          description: 'Fotos para highlight do álbum',
          fileName: 'highlight_album_01.jpg',
          fileUrl: 'https://example.com/uploads/highlight_album_01.jpg',
          fileSize: 1024000, // 1MB
          folder: 'highlights',
          status: 'draft',
          projectId: 2,
          userId: adminUser.id,
        },
      }),
    ])

    console.log('✅ Fotos do Instagram criadas:', instagramPhotos.length)

    // Criar brandings de exemplo
    const adminBranding = await prisma.branding.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        mission: "Conectar pessoas através da música e criar experiências únicas",
        vision: "Ser reconhecido como um dos principais DJs do Brasil, conhecido por sua autenticidade e inovação",
        values: "Autenticidade, inovação, conexão humana, excelência",
        voiceTone: "Descontraído e profissional",
        characteristics: "Criativo, confiável, inovador, apaixonado",
        targetAudience: "Jovens de 18-35 anos que gostam de música eletrônica e buscam experiências únicas",
        userId: adminUser.id,
        createdBy: adminUser.id,
      },
    })

    const djBranding = await prisma.branding.upsert({
      where: { userId: djUser.id },
      update: {},
      create: {
        mission: "Inspirar e emocionar através da música eletrônica",
        vision: "Ser referência no cenário de música eletrônica nacional",
        values: "Paixão, dedicação, originalidade, respeito",
        voiceTone: "Energético e inspirador",
        characteristics: "Carismático, dedicado, original, respeitoso",
        targetAudience: "Público de 20-40 anos que aprecia música eletrônica de qualidade",
        userId: djUser.id,
        createdBy: adminUser.id, // Admin criou o branding para o DJ
      },
    })

    console.log('✅ Brandings criados: 2')
    console.log('🎉 Banco de dados configurado com sucesso!')
    console.log('👑 Admin: admin@email.com / 123456')
    console.log('🎵 DJ: dj@email.com / 123456')

  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase() 
