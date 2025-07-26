import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const projectId = searchParams.get('projectId')
    const folder = searchParams.get('folder')
    const status = searchParams.get('status')

    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
    }

    const where: any = { userId: parseInt(userId) }
    
    if (projectId) {
      where.projectId = parseInt(projectId)
    }
    
    if (folder) {
      where.folder = folder
    }
    
    if (status) {
      where.status = status
    }

    const photos = await prisma.instagramPhoto.findMany({
      where,
      include: { project: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(photos)
  } catch (error) {
    console.error('Erro ao buscar fotos do Instagram:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      title, 
      description, 
      fileName, 
      fileUrl, 
      fileSize, 
      folder, 
      status, 
      scheduledDate, 
      postedDate, 
      projectId, 
      userId 
    } = await request.json()

    if (!title || !fileName || !fileUrl || !fileSize || !folder || !userId) {
      return NextResponse.json({ error: 'Campos obrigatórios não fornecidos' }, { status: 400 })
    }

    const photo = await prisma.instagramPhoto.create({
      data: {
        title,
        description,
        fileName,
        fileUrl,
        fileSize: parseInt(fileSize),
        folder,
        status: status || 'draft',
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        postedDate: postedDate ? new Date(postedDate) : null,
        projectId: projectId ? parseInt(projectId) : null,
        userId: parseInt(userId)
      },
      include: { project: true }
    })

    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar foto do Instagram:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 