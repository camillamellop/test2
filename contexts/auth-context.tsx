"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: number
  email: string
  name: string
  avatar_url?: string
  bio?: string
  location?: string
  mission?: string
  vision?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  isLoading: boolean
  isInitialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize with mock user for development
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const mockUser: User = {
          id: 1,
          email: "camilla@conexaounk.com",
          name: "Camilla Mello",
          bio: "Artista e DJ da Conexão UNK",
          location: "São Paulo, SP",
        }
        setUser(mockUser)
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: 1,
        email,
        name: "Camilla Mello",
        bio: "Artista e DJ da Conexão UNK",
        location: "São Paulo, SP",
      }
      setUser(mockUser)
    } catch (error) {
      console.error("Login error:", error)
      throw new Error("Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return

    try {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
    } catch (error) {
      console.error("Profile update error:", error)
      throw new Error("Erro ao atualizar perfil")
    }
  }

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    updateProfile,
    isLoading,
    isInitialized,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
