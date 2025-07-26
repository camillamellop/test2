"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Bell, DollarSign, Users } from "lucide-react"

interface ToastNotificationProps {
  title: string
  message: string
  type: "success" | "info" | "warning" | "error"
  onClose: () => void
  duration?: number
}

export function ToastNotification({ 
  title, 
  message, 
  type, 
  onClose, 
  duration = 5000 
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Aguarda a animação terminar
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="w-5 h-5 text-green-400" />
      case "info":
        return <Bell className="w-5 h-5 text-blue-400" />
      case "warning":
        return <DollarSign className="w-5 h-5 text-yellow-400" />
      case "error":
        return <X className="w-5 h-5 text-red-400" />
      default:
        return <Bell className="w-5 h-5 text-blue-400" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-900/90 border-green-400/30"
      case "info":
        return "bg-blue-900/90 border-blue-400/30"
      case "warning":
        return "bg-yellow-900/90 border-yellow-400/30"
      case "error":
        return "bg-red-900/90 border-red-400/30"
      default:
        return "bg-blue-900/90 border-blue-400/30"
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className={`${getBgColor()} rounded-lg border p-4 shadow-lg backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white mb-1">{title}</h4>
            <p className="text-sm text-gray-300">{message}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="flex-shrink-0 h-6 w-6 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Hook para gerenciar notificações toast
export function useToastNotifications() {
  const [toasts, setToasts] = useState<Array<{
    id: string
    title: string
    message: string
    type: "success" | "info" | "warning" | "error"
  }>>([])

  const addToast = (title: string, message: string, type: "success" | "info" | "warning" | "error" = "info") => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, title, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )

  return { addToast, ToastContainer }
} 