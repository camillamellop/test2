import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const isRead = searchParams.get('isRead')

    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
    }

    const where: any = { userId: parseInt(userId) }
    
    if (type) {
      where.type = type
    }
    
    if (isRead !== null) {
      where.isRead = isRead === 'true'
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: { event: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, message, type, eventId, userId } = await request.json()

    if (!title || !message || !type || !userId) {
      return NextResponse.json({ error: 'Campos obrigatórios não fornecidos' }, { status: 400 })
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        eventId: eventId ? parseInt(eventId) : null,
        userId: parseInt(userId)
      },
      include: { event: true }
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar notificação:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 