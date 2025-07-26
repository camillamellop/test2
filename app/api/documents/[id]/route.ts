import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar documento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = parseInt(params.id)

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        project: true
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(document)

  } catch (error) {
    console.error('Erro ao buscar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar documento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = parseInt(params.id)
    const { title, description, category, projectId } = await request.json()

    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        title,
        description,
        category,
        projectId: projectId ? parseInt(projectId) : null,
        updatedAt: new Date()
      },
      include: {
        project: true
      }
    })

    return NextResponse.json(document)

  } catch (error) {
    console.error('Erro ao atualizar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar documento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = parseInt(params.id)

    await prisma.document.delete({
      where: { id: documentId }
    })

    return NextResponse.json(
      { message: 'Documento deletado com sucesso' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erro ao deletar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 