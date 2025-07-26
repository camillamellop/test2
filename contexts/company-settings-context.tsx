"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context-prisma"

interface CompanySettings {
  id: number
  name: string
  logo?: string
  description?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  socialMedia?: {
    instagram?: string
    twitter?: string
    facebook?: string
    linkedin?: string
    youtube?: string
  }
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
  }
  createdAt: Date
  updatedAt: Date
}

interface CompanySettingsContextType {
  settings: CompanySettings | null
  updateSettings: (data: Partial<CompanySettings>) => Promise<void>
  uploadLogo: (file: File) => Promise<string>
  isLoading: boolean
}

const CompanySettingsContext = createContext<CompanySettingsContextType | undefined>(undefined)

export function CompanySettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Carregar configurações da empresa
  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/company-settings')
      
      if (response.ok) {
        const settingsData = await response.json()
        setSettings(settingsData)
      } else {
        // Se não existir, criar configurações padrão
        await createDefaultSettings()
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createDefaultSettings = async () => {
    try {
      const response = await fetch('/api/company-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "Conexão UNK",
          description: "Plataforma de gestão para profissionais da música",
          socialMedia: {
            instagram: "@conexao_unk",
            twitter: "@conexao_unk"
          },
          theme: {
            primaryColor: "#3B82F6",
            secondaryColor: "#1F2937",
            accentColor: "#F59E0B"
          }
        }),
      })

      if (response.ok) {
        const newSettings = await response.json()
        setSettings(newSettings)
      }
    } catch (error) {
      console.error('Erro ao criar configurações padrão:', error)
    }
  }

  const updateSettings = async (data: Partial<CompanySettings>) => {
    try {
      const response = await fetch('/api/company-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)
      } else {
        console.error('Erro ao atualizar configurações')
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
    }
  }

  const uploadLogo = async (file: File): Promise<string> => {
    try {
      // Simular upload de arquivo
      // Em produção, isso seria enviado para um serviço como AWS S3, Cloudinary, etc.
      const fileName = `logo_${Date.now()}_${file.name}`
      const fileUrl = `/uploads/${fileName}`
      
      // Aqui você implementaria o upload real do arquivo
      console.log('Uploading logo:', fileName)
      
      return fileUrl
    } catch (error) {
      console.error('Erro ao fazer upload do logo:', error)
      throw error
    }
  }

  return (
    <CompanySettingsContext.Provider
      value={{
        settings,
        updateSettings,
        uploadLogo,
        isLoading,
      }}
    >
      {children}
    </CompanySettingsContext.Provider>
  )
}

export function useCompanySettings() {
  const context = useContext(CompanySettingsContext)
  if (context === undefined) {
    throw new Error("useCompanySettings must be used within a CompanySettingsProvider")
  }
  return context
} 