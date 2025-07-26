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

    const notes = await prisma.note.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Erro ao buscar notas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar notas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const note = await prisma.note.create({
      data: {
        title: body.title,
        content: body.content,
        type: body.type,
        pinned: body.pinned || false,
        userId: body.userId
      }
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Erro ao criar nota:', error)
    return NextResponse.json(
      { error: 'Erro ao criar nota' },
      { status: 500 }
    )
  }
} 