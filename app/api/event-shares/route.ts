import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const eventId = searchParams.get('eventId')
    const status = searchParams.get('status')

    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
    }

    const where: any = { userId: parseInt(userId) }
    
    if (eventId) {
      where.eventId = parseInt(eventId)
    }
    
    if (status) {
      where.status = status
    }

    const eventShares = await prisma.eventShare.findMany({
      where,
      include: { 
        event: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(eventShares)
  } catch (error) {
    console.error('Erro ao buscar compartilhamentos de eventos:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { eventId, userIds } = await request.json()

    if (!eventId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'eventId e userIds são obrigatórios' }, { status: 400 })
    }

    // Criar múltiplos compartilhamentos
    const eventShares = await Promise.all(
      userIds.map(async (userId: string) => {
        return await prisma.eventShare.create({
          data: {
            eventId: parseInt(eventId),
            userId: parseInt(userId),
            status: 'pending'
          },
          include: { 
            event: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        })
      })
    )

    return NextResponse.json(eventShares, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar compartilhamento de evento:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 