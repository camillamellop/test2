import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id)
    const body = await request.json()

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        title: body.title,
        content: body.content,
        type: body.type,
        pinned: body.pinned,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error('Erro ao atualizar nota:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar nota' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id)

    await prisma.note.delete({
      where: { id: noteId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar nota:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar nota' },
      { status: 500 }
    )
  }
} 