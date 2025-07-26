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

    const entries = await prisma.selfCareEntry.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Erro ao buscar entradas de self-care:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, value, date, userId } = body

    if (!type || !value || !userId) {
      return NextResponse.json(
        { error: 'type, value e userId são obrigatórios' },
        { status: 400 }
      )
    }

    const entry = await prisma.selfCareEntry.create({
      data: {
        type,
        value,
        date: new Date(date),
        userId: parseInt(userId)
      }
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Erro ao criar entrada de self-care:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 