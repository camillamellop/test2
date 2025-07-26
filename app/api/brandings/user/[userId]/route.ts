import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const userIdInt = parseInt(userId)

    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { error: 'userId inválido' },
        { status: 400 }
      )
    }

    const branding = await prisma.branding.findUnique({
      where: { userId: userIdInt },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!branding) {
      return NextResponse.json(
        { error: 'Branding não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(branding)
  } catch (error) {
    console.error('Erro ao buscar branding do usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 