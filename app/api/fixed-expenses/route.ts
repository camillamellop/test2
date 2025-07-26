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

    const fixedExpenses = await prisma.fixedExpense.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(fixedExpenses)
  } catch (error) {
    console.error('Erro ao buscar despesas fixas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, amount, category, dueDate, userId } = body

    const fixedExpense = await prisma.fixedExpense.create({
      data: {
        name,
        amount: parseFloat(amount),
        category,
        dueDate: new Date(dueDate),
        userId: parseInt(userId)
      }
    })

    return NextResponse.json(fixedExpense)
  } catch (error) {
    console.error('Erro ao criar despesa fixa:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 