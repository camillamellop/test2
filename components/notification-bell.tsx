"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Bell, Check, X, Trash2 } from "lucide-react"
import { useNotifications } from "@/contexts/notification-context-prisma"
import { useEventShares } from "@/contexts/event-share-context-prisma"
import { useAuth } from "@/contexts/auth-context-prisma"

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, deleteNotification, markAllAsRead } = useNotifications()
  const { acceptShare, declineShare } = useEventShares()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleAcceptShare = async (shareId: number) => {
    await acceptShare(shareId)
    // Marcar notificação como lida
    const notification = notifications.find(n => n.eventId === shareId)
    if (notification) {
      await markAsRead(notification.id)
    }
  }

  const handleDeclineShare = async (shareId: number) => {
    await declineShare(shareId)
    // Marcar notificação como lida
    const notification = notifications.find(n => n.eventId === shareId)
    if (notification) {
      await markAsRead(notification.id)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="relative glass-button"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="bg-gray-800 border-gray-700 text-white w-96">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-white">Notificações</SheetTitle>
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  size="sm"
                  className="glass-button"
                >
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.isRead 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-orange-500/10 border-orange-400/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-300 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.isRead && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                      
                      {notification.type === "event_share" && notification.eventId && (
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleAcceptShare(notification.eventId!)}
                            size="sm"
                            className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                          >
                            Aceitar
                          </Button>
                          <Button
                            onClick={() => handleDeclineShare(notification.eventId!)}
                            size="sm"
                            className="h-6 px-2 text-xs bg-red-600 hover:bg-red-700"
                          >
                            Recusar
                          </Button>
                        </div>
                      )}
                      
                      <Button
                        onClick={() => deleteNotification(notification.id)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
} 