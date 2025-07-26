import { NextRequest, NextResponse } from 'next/server'

interface Holiday {
  date: string
  name: string
  type: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    // Buscar feriados da Brasil API
    const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`)
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar feriados: ${response.status}`)
    }

    const holidays: Holiday[] = await response.json()

    // Filtrar apenas feriados nacionais
    const nationalHolidays = holidays.filter(holiday => 
      holiday.type === 'national' || 
      holiday.type === 'federal' ||
      holiday.name.toLowerCase().includes('natal') ||
      holiday.name.toLowerCase().includes('páscoa') ||
      holiday.name.toLowerCase().includes('carnaval')
    )

    return NextResponse.json(nationalHolidays)
  } catch (error) {
    console.error('Erro ao buscar feriados:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar feriados' },
      { status: 500 }
    )
  }
} 