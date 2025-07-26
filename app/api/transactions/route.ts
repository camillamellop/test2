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

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { userId: parseInt(userId) },
          { assignedTo: parseInt(userId) }
        ]
      },
      include: {
        user: true,
        assignedUser: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, amount, description, category, date, userId, assignedTo, receiptUrl } = body

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        description,
        category,
        date: new Date(date),
        userId: parseInt(userId),
        assignedTo: assignedTo ? parseInt(assignedTo) : null,
        receiptUrl
      }
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Erro ao criar transação:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 