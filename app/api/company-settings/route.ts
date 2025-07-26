import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Buscar as configurações da empresa (sempre a primeira, pois é única)
    const settings = await prisma.companySettings.findFirst()

    if (!settings) {
      return NextResponse.json(
        { error: 'Configurações não encontradas' },
        { status: 404 }
      )
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const settings = await prisma.companySettings.create({
      data: {
        name: body.name || "Conexão UNK",
        logo: body.logo,
        description: body.description,
        website: body.website,
        email: body.email,
        phone: body.phone,
        address: body.address,
        socialMedia: body.socialMedia,
        theme: body.theme,
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao criar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao criar configurações' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Buscar configurações existentes
    const existingSettings = await prisma.companySettings.findFirst()

    if (!existingSettings) {
      return NextResponse.json(
        { error: 'Configurações não encontradas' },
        { status: 404 }
      )
    }

    const updatedSettings = await prisma.companySettings.update({
      where: { id: existingSettings.id },
      data: {
        name: body.name,
        logo: body.logo,
        description: body.description,
        website: body.website,
        email: body.email,
        phone: body.phone,
        address: body.address,
        socialMedia: body.socialMedia,
        theme: body.theme,
        updatedAt: new Date(),
      }
    })

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações' },
      { status: 500 }
    )
  }
} 