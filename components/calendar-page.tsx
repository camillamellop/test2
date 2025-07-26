"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Calendar } from "lucide-react"
import { useEvents } from "@/contexts/event-context-prisma"
import { TopHeader } from "./top-header"
import { BottomNavigation } from "./bottom-navigation"
import { EventSheet } from "./event-sheet"

export function CalendarPage() {
  const { events, holidays, getEventsForDate, getHolidaysForDate } = useEvents()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [showEventSheet, setShowEventSheet] = useState(false)

  // Função para formatar data corretamente
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ]

  const weekDays = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      const fullDate = formatDate(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate())
      days.push({
        date: prevDate.getDate(),
        isCurrentMonth: false,
        fullDate,
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = formatDate(year, month, day)
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate,
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day)
      const fullDate = formatDate(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate())
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate,
      })
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDateClick = (fullDate: string) => {
    setSelectedDate(fullDate)
  }

  const isToday = (fullDate: string) => {
    const today = new Date()
    const todayString = formatDate(today.getFullYear(), today.getMonth(), today.getDate())
    return fullDate === todayString
  }

  const getDayEvents = (fullDate: string) => {
    return getEventsForDate(fullDate)
  }

  const getDayHolidays = (fullDate: string) => {
    return getHolidaysForDate(fullDate)
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <TopHeader />
      
      <div className="p-4 space-y-6">
        {/* Header do Calendário */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth("prev")}
              className="glass-button"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <h1 className="text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth("next")}
              className="glass-button"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
            <Button
              onClick={() => setShowEventSheet(true)}
              className="glass-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          </div>
        </div>

        {/* Calendário */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário Principal */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardContent className="p-6">
                {/* Dias da semana */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-400 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Dias do mês */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const dayEvents = getDayEvents(day.fullDate)
                    const dayHolidays = getDayHolidays(day.fullDate)
                    const hasEvents = dayEvents.length > 0
                    const hasHolidays = dayHolidays.length > 0

                    return (
                      <div
                        key={index}
                        onClick={() => handleDateClick(day.fullDate)}
                        className={`
                          min-h-[80px] p-2 border border-gray-700 rounded-lg cursor-pointer
                          transition-all duration-200 hover:bg-gray-700/50
                          ${day.isCurrentMonth ? "bg-gray-800/50" : "bg-gray-900/30 text-gray-500"}
                          ${isToday(day.fullDate) ? "border-blue-400 bg-blue-900/20" : ""}
                          ${selectedDate === day.fullDate ? "border-orange-400 bg-orange-900/20" : ""}
                        `}
                      >
                        <div className="text-sm font-medium mb-1">
                          {day.date}
                        </div>
                        
                        {/* Indicadores de eventos e feriados */}
                        <div className="space-y-1">
                          {hasHolidays && (
                            <div className="flex flex-wrap gap-1">
                              {dayHolidays.map((holiday, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs bg-red-500/20 text-red-300 border-red-500/30"
                                >
                                  <Calendar className="w-2 h-2 mr-1" />
                                  {holiday.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {hasEvents && (
                            <div className="flex flex-wrap gap-1">
                              {dayEvents.slice(0, 2).map((event, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30"
                                >
                                  {event.title}
                                </Badge>
                              ))}
                              {dayEvents.length > 2 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-gray-500/20 text-gray-300 border-gray-500/30"
                                >
                                  +{dayEvents.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seção de Eventos do Dia Selecionado */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">
                  {new Date(selectedDate).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const selectedDayEvents = getDayEvents(selectedDate)
                  const selectedDayHolidays = getDayHolidays(selectedDate)
                  
                  if (selectedDayEvents.length === 0 && selectedDayHolidays.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-400">Nenhum evento para este dia.</p>
                      </div>
                    )
                  }

                  return (
                    <div className="space-y-4">
                      {/* Feriados */}
                      {selectedDayHolidays.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-2">Feriados</h3>
                          <div className="space-y-2">
                            {selectedDayHolidays.map((holiday, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-red-400" />
                                  <span className="text-sm font-medium text-red-300">
                                    {holiday.name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Eventos */}
                      {selectedDayEvents.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-2">Eventos</h3>
                          <div className="space-y-2">
                            {selectedDayEvents.map((event, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                              >
                                <div className="font-medium text-blue-300 mb-1">
                                  {event.title}
                                </div>
                                {event.description && (
                                  <div className="text-sm text-gray-400">
                                    {event.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500/20 border border-red-500/30 rounded"></div>
            <span className="text-gray-300">Feriados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500/20 border border-blue-500/30 rounded"></div>
            <span className="text-gray-300">Eventos</span>
          </div>
        </div>
      </div>

      <BottomNavigation />

      <EventSheet
        isOpen={showEventSheet}
        onClose={() => setShowEventSheet(false)}
        selectedDate={selectedDate}
      />
    </div>
  )
}
