"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context-prisma"

// Tipos para compartilhamento de eventos
export interface EventShare {
  id: number
  eventId: number
  userId: number
  status: "pending" | "accepted" | "declined"
  createdAt: Date
  updatedAt: Date
  event?: {
    id: number
    title: string
    description?: string
    date: Date
    time?: string
    location?: string
    type: string
  }
  user?: {
    id: number
    name?: string
    email: string
  }
}

interface EventShareContextType {
  eventShares: EventShare[]
  isLoading: boolean
  loadEventShares: () => Promise<void>
  shareEvent: (eventId: number, userIds: number[]) => Promise<boolean>
  acceptShare: (shareId: number) => Promise<boolean>
  declineShare: (shareId: number) => Promise<boolean>
  getSharesForEvent: (eventId: number) => EventShare[]
  getSharesForUser: (userId: number) => EventShare[]
}

const EventShareContext = createContext<EventShareContextType | undefined>(undefined)

export function EventShareProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [eventShares, setEventShares] = useState<EventShare[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadEventShares()
    }
  }, [user])

  const loadEventShares = async () => {
    if (!user) return
    try {
      setIsLoading(true)
      const response = await fetch(`/api/event-shares?userId=${user.id}`)
      if (response.ok) {
        const sharesData = await response.json()
        setEventShares(sharesData)
      } else {
        console.error('Erro ao carregar compartilhamentos de eventos')
      }
    } catch (error) {
      console.error('Erro ao carregar compartilhamentos de eventos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const shareEvent = async (eventId: number, userIds: number[]): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/event-shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, userIds }),
      })
      if (response.ok) {
        const newShares = await response.json()
        setEventShares(prev => [...newShares, ...prev])
        return true
      } else {
        console.error('Erro ao compartilhar evento')
        return false
      }
    } catch (error) {
      console.error('Erro ao compartilhar evento:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const acceptShare = async (shareId: number): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/event-shares/${shareId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      })
      if (response.ok) {
        setEventShares(prev => prev.map(s => s.id === shareId ? { ...s, status: 'accepted' } : s))
        return true
      } else {
        console.error('Erro ao aceitar compartilhamento')
        return false
      }
    } catch (error) {
      console.error('Erro ao aceitar compartilhamento:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const declineShare = async (shareId: number): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/event-shares/${shareId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'declined' }),
      })
      if (response.ok) {
        setEventShares(prev => prev.map(s => s.id === shareId ? { ...s, status: 'declined' } : s))
        return true
      } else {
        console.error('Erro ao recusar compartilhamento')
        return false
      }
    } catch (error) {
      console.error('Erro ao recusar compartilhamento:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getSharesForEvent = (eventId: number): EventShare[] => {
    return eventShares.filter(share => share.eventId === eventId)
  }

  const getSharesForUser = (userId: number): EventShare[] => {
    return eventShares.filter(share => share.userId === userId)
  }

  return (
    <EventShareContext.Provider value={{
      eventShares,
      isLoading,
      loadEventShares,
      shareEvent,
      acceptShare,
      declineShare,
      getSharesForEvent,
      getSharesForUser,
    }}>
      {children}
    </EventShareContext.Provider>
  )
}

export function useEventShares() {
  const context = useContext(EventShareContext)
  if (context === undefined) {
    throw new Error('useEventShares deve ser usado dentro de um EventShareProvider')
  }
  return context
} 