import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = parseInt(params.id)
    const photo = await prisma.instagramPhoto.findUnique({
      where: { id: photoId },
      include: { project: true }
    })

    if (!photo) {
      return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 })
    }

    return NextResponse.json(photo)
  } catch (error) {
    console.error('Erro ao buscar foto do Instagram:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = parseInt(params.id)
    const updateData = await request.json()

    const photo = await prisma.instagramPhoto.update({
      where: { id: photoId },
      data: {
        title: updateData.title,
        description: updateData.description,
        fileName: updateData.fileName,
        fileUrl: updateData.fileUrl,
        fileSize: updateData.fileSize ? parseInt(updateData.fileSize) : undefined,
        folder: updateData.folder,
        status: updateData.status,
        scheduledDate: updateData.scheduledDate ? new Date(updateData.scheduledDate) : null,
        postedDate: updateData.postedDate ? new Date(updateData.postedDate) : null,
        projectId: updateData.projectId ? parseInt(updateData.projectId) : null,
      },
      include: { project: true }
    })

    return NextResponse.json(photo)
  } catch (error) {
    console.error('Erro ao atualizar foto do Instagram:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = parseInt(params.id)
    await prisma.instagramPhoto.delete({ where: { id: photoId } })
    return NextResponse.json({ message: 'Foto deletada com sucesso' }, { status: 200 })
  } catch (error) {
    console.error('Erro ao deletar foto do Instagram:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 