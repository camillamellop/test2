import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      )
    }

    const events = await prisma.event.findMany({
      where: {
        OR: [
          { userId: parseInt(userId) },
          { 
            isShared: true,
            sharedWith: {
              some: {
                userId: parseInt(userId),
                status: 'accepted'
              }
            }
          }
        ]
      },
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar eventos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        time: body.time,
        location: body.location,
        fee: body.fee,
        status: body.status || 'scheduled',
        userId: body.userId,
        createdBy: body.createdBy,
        isShared: body.isShared || false
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    return NextResponse.json(
      { error: 'Erro ao criar evento' },
      { status: 500 }
    )
  }
} 