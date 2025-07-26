import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar projeto específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id)

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: true,
        documents: true
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)

  } catch (error) {
    console.error('Erro ao buscar projeto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar projeto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id)
    const { title, description, category, status, progress, deadline } = await request.json()

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        description,
        category,
        status,
        progress,
        deadline: deadline ? new Date(deadline) : null,
        updatedAt: new Date()
      },
      include: {
        tasks: true,
        documents: true
      }
    })

    return NextResponse.json(project)

  } catch (error) {
    console.error('Erro ao atualizar projeto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar projeto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id)

    // Deletar projeto (tarefas e documentos serão deletados automaticamente devido ao CASCADE)
    await prisma.project.delete({
      where: { id: projectId }
    })

    return NextResponse.json(
      { message: 'Projeto deletado com sucesso' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erro ao deletar projeto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 