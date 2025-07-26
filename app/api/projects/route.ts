import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar projetos do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    const projects = await prisma.project.findMany({
      where: { userId: parseInt(userId) },
      include: {
        tasks: true,
        documents: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)

  } catch (error) {
    console.error('Erro ao buscar projetos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo projeto
export async function POST(request: NextRequest) {
  try {
    const { title, description, category, status, progress, deadline, userId } = await request.json()

    if (!title || !userId) {
      return NextResponse.json(
        { error: 'Título e ID do usuário são obrigatórios' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        category: category || 'other',
        status: status || 'active',
        progress: progress || 0,
        deadline: deadline ? new Date(deadline) : null,
        userId: parseInt(userId)
      },
      include: {
        tasks: true,
        documents: true
      }
    })

    return NextResponse.json(project, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar projeto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 