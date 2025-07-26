import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar documentos do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const projectId = searchParams.get('projectId')
    const category = searchParams.get('category')

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    const where: any = { userId: parseInt(userId) }

    if (projectId) {
      where.projectId = parseInt(projectId)
    }

    if (category) {
      where.category = category
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        project: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(documents)

  } catch (error) {
    console.error('Erro ao buscar documentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo documento
export async function POST(request: NextRequest) {
  try {
    const { 
      title, 
      description, 
      fileName, 
      fileUrl, 
      fileType, 
      fileSize, 
      category, 
      projectId, 
      userId 
    } = await request.json()

    if (!title || !fileName || !fileUrl || !fileType || !fileSize || !category || !userId) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      )
    }

    const document = await prisma.document.create({
      data: {
        title,
        description,
        fileName,
        fileUrl,
        fileType,
        fileSize: parseInt(fileSize),
        category,
        projectId: projectId ? parseInt(projectId) : null,
        userId: parseInt(userId)
      },
      include: {
        project: true
      }
    })

    return NextResponse.json(document, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 