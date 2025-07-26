"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context-prisma"

interface Branding {
  id: number
  mission?: string
  vision?: string
  values?: string
  voiceTone?: string
  characteristics?: string
  targetAudience?: string
  userId: number
  createdBy: number
  createdAt: Date
  updatedAt: Date
}

interface BrandingContextType {
  brandings: Branding[]
  userBranding: Branding | null
  loadBrandings: () => Promise<void>
  loadUserBranding: (userId: number) => Promise<void>
  createBranding: (data: Omit<Branding, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateBranding: (id: number, data: Partial<Omit<Branding, "id" | "userId" | "createdBy" | "createdAt" | "updatedAt">>) => Promise<void>
  deleteBranding: (id: number) => Promise<void>
  isLoading: boolean
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined)

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [brandings, setBrandings] = useState<Branding[]>([])
  const [userBranding, setUserBranding] = useState<Branding | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Carregar branding do usuário automaticamente
  useEffect(() => {
    if (user) {
      loadUserBranding(user.id)
    }
  }, [user])

  const loadBrandings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/brandings')
      if (response.ok) {
        const data = await response.json()
        setBrandings(data)
      }
    } catch (error) {
      console.error('Erro ao carregar brandings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserBranding = async (userId: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/brandings/user/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUserBranding(data)
      } else if (response.status === 404) {
        setUserBranding(null)
      }
    } catch (error) {
      console.error('Erro ao carregar branding do usuário:', error)
      setUserBranding(null)
    } finally {
      setIsLoading(false)
    }
  }

  const createBranding = async (data: Omit<Branding, "id" | "createdAt" | "updatedAt">) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/brandings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await loadBrandings()
        await loadUserBranding(data.userId)
      } else {
        const error = await response.json()
        console.error('Erro ao criar branding:', error.error)
      }
    } catch (error) {
      console.error('Erro ao criar branding:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateBranding = async (id: number, data: Partial<Omit<Branding, "id" | "userId" | "createdBy" | "createdAt" | "updatedAt">>) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/brandings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await loadBrandings()
        if (userBranding && userBranding.id === id) {
          await loadUserBranding(userBranding.userId)
        }
      } else {
        const error = await response.json()
        console.error('Erro ao atualizar branding:', error.error)
      }
    } catch (error) {
      console.error('Erro ao atualizar branding:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteBranding = async (id: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/brandings/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadBrandings()
        if (userBranding && userBranding.id === id) {
          setUserBranding(null)
        }
      } else {
        const error = await response.json()
        console.error('Erro ao deletar branding:', error.error)
      }
    } catch (error) {
      console.error('Erro ao deletar branding:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BrandingContext.Provider value={{
      brandings,
      userBranding,
      loadBrandings,
      loadUserBranding,
      createBranding,
      updateBranding,
      deleteBranding,
      isLoading,
    }}>
      {children}
    </BrandingContext.Provider>
  )
}

export function useBranding() {
  const context = useContext(BrandingContext)
  if (context === undefined) {
    throw new Error('useBranding deve ser usado dentro de um BrandingProvider')
  }
  return context
} 