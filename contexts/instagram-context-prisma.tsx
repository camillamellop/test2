"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context-prisma"

// Tipos para fotos do Instagram
export interface InstagramPhoto {
  id: number
  title: string
  description?: string
  fileName: string
  fileUrl: string
  fileSize: number
  folder: "posts" | "stories" | "reels" | "highlights" | "other"
  status: "draft" | "scheduled" | "posted"
  scheduledDate?: Date
  postedDate?: Date
  projectId?: number
  userId: number
  createdAt: Date
  updatedAt: Date
}

interface InstagramContextType {
  photos: InstagramPhoto[]
  isLoading: boolean
  loadPhotos: () => Promise<void>
  addPhoto: (photo: Omit<InstagramPhoto, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<boolean>
  updatePhoto: (id: number, photo: Partial<InstagramPhoto>) => Promise<boolean>
  deletePhoto: (id: number) => Promise<boolean>
  getPhotosByFolder: (folder: string) => InstagramPhoto[]
  getPhotosByProject: (projectId: number) => InstagramPhoto[]
  getPhotosByStatus: (status: string) => InstagramPhoto[]
}

const InstagramContext = createContext<InstagramContextType | undefined>(undefined)

export function InstagramProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [photos, setPhotos] = useState<InstagramPhoto[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadPhotos()
    }
  }, [user])

  const loadPhotos = async () => {
    if (!user) return
    try {
      setIsLoading(true)
      const response = await fetch(`/api/instagram-photos?userId=${user.id}`)
      if (response.ok) {
        const photosData = await response.json()
        setPhotos(photosData)
      } else {
        console.error('Erro ao carregar fotos do Instagram')
      }
    } catch (error) {
      console.error('Erro ao carregar fotos do Instagram:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addPhoto = async (photo: Omit<InstagramPhoto, "id" | "userId" | "createdAt" | "updatedAt">): Promise<boolean> => {
    if (!user) return false
    try {
      setIsLoading(true)
      const response = await fetch('/api/instagram-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...photo, userId: user.id }),
      })
      if (response.ok) {
        const newPhoto = await response.json()
        setPhotos(prev => [newPhoto, ...prev])
        return true
      } else {
        console.error('Erro ao adicionar foto')
        return false
      }
    } catch (error) {
      console.error('Erro ao adicionar foto:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updatePhoto = async (id: number, photo: Partial<InstagramPhoto>): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/instagram-photos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photo),
      })
      if (response.ok) {
        const updatedPhoto = await response.json()
        setPhotos(prev => prev.map(p => p.id === id ? updatedPhoto : p))
        return true
      } else {
        console.error('Erro ao atualizar foto')
        return false
      }
    } catch (error) {
      console.error('Erro ao atualizar foto:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const deletePhoto = async (id: number): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/instagram-photos/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setPhotos(prev => prev.filter(p => p.id !== id))
        return true
      } else {
        console.error('Erro ao deletar foto')
        return false
      }
    } catch (error) {
      console.error('Erro ao deletar foto:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getPhotosByFolder = (folder: string): InstagramPhoto[] => {
    return photos.filter(photo => photo.folder === folder)
  }

  const getPhotosByProject = (projectId: number): InstagramPhoto[] => {
    return photos.filter(photo => photo.projectId === projectId)
  }

  const getPhotosByStatus = (status: string): InstagramPhoto[] => {
    return photos.filter(photo => photo.status === status)
  }

  return (
    <InstagramContext.Provider value={{
      photos,
      isLoading,
      loadPhotos,
      addPhoto,
      updatePhoto,
      deletePhoto,
      getPhotosByFolder,
      getPhotosByProject,
      getPhotosByStatus,
    }}>
      {children}
    </InstagramContext.Provider>
  )
}

export function useInstagram() {
  const context = useContext(InstagramContext)
  if (context === undefined) {
    throw new Error('useInstagram deve ser usado dentro de um InstagramProvider')
  }
  return context
} 