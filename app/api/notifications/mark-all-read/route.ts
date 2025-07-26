import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
    }

    await prisma.notification.updateMany({
      where: { 
        userId: parseInt(userId),
        isRead: false
      },
      data: { isRead: true }
    })

    return NextResponse.json({ message: 'Todas as notificações foram marcadas como lidas' }, { status: 200 })
  } catch (error) {
    console.error('Erro ao marcar notificações como lidas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 