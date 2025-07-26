import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
    }

    const debts = await prisma.debt.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(debts)
  } catch (error) {
    console.error('Erro ao buscar dívidas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, amount, description, dueDate, userId } = body

    const debt = await prisma.debt.create({
      data: {
        name,
        amount: parseFloat(amount),
        description,
        dueDate: new Date(dueDate),
        userId: parseInt(userId)
      }
    })

    return NextResponse.json(debt)
  } catch (error) {
    console.error('Erro ao criar dívida:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 