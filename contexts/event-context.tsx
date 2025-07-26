"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useAuth } from "./auth-context"

interface Event {
  id: number
  title: string
  description?: string
  date: string
  time?: string
  location?: string
  fee?: number
  status: "scheduled" | "completed" | "cancelled"
}

interface EventContextType {
  events: Event[]
  addEvent: (event: Omit<Event, "id">) => Promise<void>
  updateEvent: (id: number, event: Partial<Event>) => Promise<void>
  deleteEvent: (id: number) => Promise<void>
  getEventsForDate: (date: string) => Event[]
  isLoading: boolean
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const addEvent = async (eventData: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now(), // Simular ID único
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const updateEvent = async (id: number, eventData: Partial<Event>) => {
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, ...eventData } : event)))
  }

  const deleteEvent = async (id: number) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
  }

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date)
  }

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventsForDate,
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
