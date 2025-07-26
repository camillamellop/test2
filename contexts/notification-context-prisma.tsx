"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context-prisma"
import { useToastNotification } from "./toast-notification-context"

// Tipos para notificações
export interface Notification {
  id: number
  title: string
  message: string
  type: "event_share" | "event_reminder" | "system"
  isRead: boolean
  userId: number
  eventId?: number
  createdAt: Date
  updatedAt: Date
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  loadNotifications: () => Promise<void>
  markAsRead: (id: number) => Promise<boolean>
  markAllAsRead: () => Promise<boolean>
  deleteNotification: (id: number) => Promise<boolean>
  createNotification: (notification: Omit<Notification, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<boolean>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadNotifications()
    }
  }, [user])

  const loadNotifications = async () => {
    if (!user) return
    try {
      setIsLoading(true)
      const response = await fetch(`/api/notifications?userId=${user.id}`)
      if (response.ok) {
        const notificationsData = await response.json()
        setNotifications(notificationsData)
      } else {
        console.error('Erro ao carregar notificações')
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: number): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })
      if (response.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
        return true
      } else {
        console.error('Erro ao marcar notificação como lida')
        return false
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const markAllAsRead = async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/notifications/mark-all-read?userId=${user?.id}`, {
        method: 'PUT',
      })
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        return true
      } else {
        console.error('Erro ao marcar todas as notificações como lidas')
        return false
      }
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const deleteNotification = async (id: number): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id))
        return true
      } else {
        console.error('Erro ao deletar notificação')
        return false
      }
    } catch (error) {
      console.error('Erro ao deletar notificação:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const createNotification = async (notification: Omit<Notification, "id" | "userId" | "createdAt" | "updatedAt">): Promise<boolean> => {
    if (!user) return false
    try {
      setIsLoading(true)
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...notification, userId: user.id }),
      })
      if (response.ok) {
        const newNotification = await response.json()
        setNotifications(prev => [newNotification, ...prev])
        return true
      } else {
        console.error('Erro ao criar notificação')
        return false
      }
    } catch (error) {
      console.error('Erro ao criar notificação:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isLoading,
      loadNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      createNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider')
  }
  return context
} 