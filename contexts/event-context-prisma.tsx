"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context-prisma"

interface Event {
  id: number
  title: string
  description?: string
  date: string
  time?: string
  location?: string
  fee?: number
  status: "scheduled" | "completed" | "cancelled"
  userId: number
  isShared: boolean
  createdBy: number
  createdAt: Date
  updatedAt: Date
}

interface Holiday {
  date: string
  name: string
  type: string
}

interface EventContextType {
  events: Event[]
  holidays: Holiday[]
  addEvent: (event: Omit<Event, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>
  updateEvent: (id: number, event: Partial<Event>) => Promise<void>
  deleteEvent: (id: number) => Promise<void>
  getEventsForDate: (date: string) => Event[]
  getHolidaysForDate: (date: string) => Holiday[]
  isLoading: boolean
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export function EventProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Carregar eventos do usuário e feriados
  useEffect(() => {
    if (user) {
      loadEvents()
      loadHolidays()
    }
  }, [user])

  const loadEvents = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/events?userId=${user.id}`)
      
      if (response.ok) {
        const eventsData = await response.json()
        setEvents(eventsData)
      } else {
        console.error('Erro ao carregar eventos')
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadHolidays = async () => {
    try {
      const currentYear = new Date().getFullYear()
      const response = await fetch(`/api/holidays?year=${currentYear}`)
      
      if (response.ok) {
        const holidaysData = await response.json()
        setHolidays(holidaysData)
      } else {
        console.error('Erro ao carregar feriados')
      }
    } catch (error) {
      console.error('Erro ao carregar feriados:', error)
    }
  }

  const addEvent = async (eventData: Omit<Event, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          userId: user.id,
          createdBy: user.id,
        }),
      })

      if (response.ok) {
        const newEvent = await response.json()
        setEvents(prev => [...prev, newEvent])
      } else {
        console.error('Erro ao adicionar evento')
      }
    } catch (error) {
      console.error('Erro ao adicionar evento:', error)
    }
  }

  const updateEvent = async (id: number, eventData: Partial<Event>) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        const updatedEvent = await response.json()
        setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event))
      } else {
        console.error('Erro ao atualizar evento')
      }
    } catch (error) {
      console.error('Erro ao atualizar evento:', error)
    }
  }

  const deleteEvent = async (id: number) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEvents(prev => prev.filter(event => event.id !== id))
      } else {
        console.error('Erro ao deletar evento')
      }
    } catch (error) {
      console.error('Erro ao deletar evento:', error)
    }
  }

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date)
  }

  const getHolidaysForDate = (date: string) => {
    return holidays.filter((holiday) => holiday.date === date)
  }

  return (
    <EventContext.Provider
      value={{
        events,
        holidays,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventsForDate,
        getHolidaysForDate,
        isLoading,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider")
  }
  return context
} 