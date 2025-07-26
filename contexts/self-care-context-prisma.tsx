"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context-prisma"

interface SelfCareEntry {
  id: number
  type: "mood" | "sleep" | "activity" | "gratitude"
  value: string | number
  date: string
  notes?: string
  userId: number
  createdAt: Date
  updatedAt: Date
}

interface SelfCareMetrics {
  activeDays: number
  mood: string
  sleep: string
  gratitude: number
}

interface SelfCareContextType {
  entries: SelfCareEntry[]
  metrics: SelfCareMetrics
  addEntry: (entry: Omit<SelfCareEntry, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>
  updateEntry: (id: number, entry: Partial<SelfCareEntry>) => Promise<void>
  deleteEntry: (id: number) => Promise<void>
  getEntriesForDate: (date: string) => SelfCareEntry[]
  getRecentEntries: () => SelfCareEntry[]
  isLoading: boolean
}

const SelfCareContext = createContext<SelfCareContextType | undefined>(undefined)

export function SelfCareProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [entries, setEntries] = useState<SelfCareEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Carregar entradas do usuário
  useEffect(() => {
    if (user) {
      loadEntries()
    }
  }, [user])

  const loadEntries = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/self-care?userId=${user.id}`)
      
      if (response.ok) {
        const entriesData = await response.json()
        setEntries(entriesData)
      } else {
        console.error('Erro ao carregar entradas de self-care')
      }
    } catch (error) {
      console.error('Erro ao carregar entradas de self-care:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addEntry = async (entryData: Omit<SelfCareEntry, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return

    try {
      const response = await fetch('/api/self-care', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: entryData.type,
          value: entryData.value,
          date: entryData.date,
          userId: user.id,
        }),
      })

      if (response.ok) {
        const newEntry = await response.json()
        setEntries(prev => [...prev, newEntry])
      } else {
        console.error('Erro ao adicionar entrada')
      }
    } catch (error) {
      console.error('Erro ao adicionar entrada:', error)
    }
  }

  const updateEntry = async (id: number, entryData: Partial<SelfCareEntry>) => {
    try {
      const response = await fetch(`/api/self-care/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      })

      if (response.ok) {
        const updatedEntry = await response.json()
        setEntries(prev => prev.map(entry => entry.id === id ? updatedEntry : entry))
      } else {
        console.error('Erro ao atualizar entrada')
      }
    } catch (error) {
      console.error('Erro ao atualizar entrada:', error)
    }
  }

  const deleteEntry = async (id: number) => {
    try {
      const response = await fetch(`/api/self-care/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEntries(prev => prev.filter(entry => entry.id !== id))
      } else {
        console.error('Erro ao deletar entrada')
      }
    } catch (error) {
      console.error('Erro ao deletar entrada:', error)
    }
  }

  const getEntriesForDate = (date: string) => {
    return entries.filter((entry) => entry.date === date)
  }

  const getRecentEntries = () => {
    return entries.slice(-5).reverse()
  }

  // Calcular métricas baseadas nos dados
  const calculateMetrics = (): SelfCareMetrics => {
    const today = new Date().toISOString().split("T")[0]
    const todayEntries = getEntriesForDate(today)
    
    const activeDays = new Set(entries.map(entry => entry.date)).size
    const moodEntry = todayEntries.find(entry => entry.type === "mood")
    const sleepEntry = todayEntries.find(entry => entry.type === "sleep")
    const gratitudeCount = todayEntries.filter(entry => entry.type === "gratitude").length

    return {
      activeDays,
      mood: moodEntry?.value.toString() || "N/A",
      sleep: sleepEntry?.value.toString() || "0.0h",
      gratitude: gratitudeCount,
    }
  }

  const metrics = calculateMetrics()

  return (
    <SelfCareContext.Provider
      value={{
        entries,
        metrics,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntriesForDate,
        getRecentEntries,
        isLoading,
      }}
    >
      {children}
    </SelfCareContext.Provider>
  )
}

export function useSelfCare() {
  const context = useContext(SelfCareContext)
  if (context === undefined) {
    throw new Error("useSelfCare must be used within a SelfCareProvider")
  }
  return context
} 