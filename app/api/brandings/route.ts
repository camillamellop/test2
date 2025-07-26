import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const createdBy = searchParams.get('createdBy')
    const userId = searchParams.get('userId')

    let where: any = {}

    if (createdBy) {
      where.createdBy = parseInt(createdBy)
    }

    if (userId) {
      where.userId = parseInt(userId)
    }

    const brandings = await prisma.branding.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(brandings)
  } catch (error) {
    console.error('Erro ao buscar brandings:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mission, vision, values, voiceTone, characteristics, targetAudience, userId, createdBy } = body

    if (!userId || !createdBy) {
      return NextResponse.json(
        { error: 'userId e createdBy são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe um branding para este usuário
    const existingBranding = await prisma.branding.findUnique({
      where: { userId: parseInt(userId) }
    })

    if (existingBranding) {
      return NextResponse.json(
        { error: 'Já existe um branding para este usuário' },
        { status: 409 }
      )
    }

    const branding = await prisma.branding.create({
      data: {
        mission,
        vision,
        values,
        voiceTone,
        characteristics,
        targetAudience,
        userId: parseInt(userId),
        createdBy: parseInt(createdBy),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      }
    })

    return NextResponse.json(branding, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar branding:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 