"use client"

import React, { createContext, useContext, useState } from "react"
import { ToastNotification, useToastNotifications } from "@/components/toast-notification"

interface ToastNotificationContextType {
  showToast: (title: string, message: string, type?: "success" | "info" | "warning" | "error") => void
  showSuccess: (title: string, message: string) => void
  showInfo: (title: string, message: string) => void
  showWarning: (title: string, message: string) => void
  showError: (title: string, message: string) => void
  ToastContainer: React.ComponentType
}

const ToastNotificationContext = createContext<ToastNotificationContextType | undefined>(undefined)

export function ToastNotificationProvider({ children }: { children: React.ReactNode }) {
  const { addToast, ToastContainer } = useToastNotifications()

  const showToast = (title: string, message: string, type: "success" | "info" | "warning" | "error" = "info") => {
    addToast(title, message, type)
  }

  const showSuccess = (title: string, message: string) => {
    addToast(title, message, "success")
  }

  const showInfo = (title: string, message: string) => {
    addToast(title, message, "info")
  }

  const showWarning = (title: string, message: string) => {
    addToast(title, message, "warning")
  }

  const showError = (title: string, message: string) => {
    addToast(title, message, "error")
  }

  return (
    <ToastNotificationContext.Provider value={{
      showToast,
      showSuccess,
      showInfo,
      showWarning,
      showError,
      ToastContainer
    }}>
      {children}
      <ToastContainer />
    </ToastNotificationContext.Provider>
  )
}

export function useToastNotification() {
  const context = useContext(ToastNotificationContext)
  if (context === undefined) {
    throw new Error("useToastNotification must be used within a ToastNotificationProvider")
  }
  return context
} 