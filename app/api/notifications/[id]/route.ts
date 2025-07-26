import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = parseInt(params.id)
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: { event: true }
    })

    if (!notification) {
      return NextResponse.json({ error: 'Notificação não encontrada' }, { status: 404 })
    }

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Erro ao buscar notificação:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = parseInt(params.id)
    const updateData = await request.json()

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        title: updateData.title,
        message: updateData.message,
        type: updateData.type,
        isRead: updateData.isRead,
        eventId: updateData.eventId ? parseInt(updateData.eventId) : null,
      },
      include: { event: true }
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = parseInt(params.id)
    await prisma.notification.delete({ where: { id: notificationId } })
    return NextResponse.json({ message: 'Notificação deletada com sucesso' }, { status: 200 })
  } catch (error) {
    console.error('Erro ao deletar notificação:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 