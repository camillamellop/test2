import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shareId = parseInt(params.id)
    const eventShare = await prisma.eventShare.findUnique({
      where: { id: shareId },
      include: { 
        event: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!eventShare) {
      return NextResponse.json({ error: 'Compartilhamento não encontrado' }, { status: 404 })
    }

    return NextResponse.json(eventShare)
  } catch (error) {
    console.error('Erro ao buscar compartilhamento:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shareId = parseInt(params.id)
    const updateData = await request.json()

    const eventShare = await prisma.eventShare.update({
      where: { id: shareId },
      data: {
        status: updateData.status,
      },
      include: { 
        event: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(eventShare)
  } catch (error) {
    console.error('Erro ao atualizar compartilhamento:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shareId = parseInt(params.id)
    await prisma.eventShare.delete({ where: { id: shareId } })
    return NextResponse.json({ message: 'Compartilhamento deletado com sucesso' }, { status: 200 })
  } catch (error) {
    console.error('Erro ao deletar compartilhamento:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 