"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context-prisma"

interface Note {
  id: number
  title?: string
  content: string
  type: "general" | "diary" | "gratitude"
  pinned: boolean
  userId: number
  createdAt: Date
  updatedAt: Date
}

interface NoteContextType {
  notes: Note[]
  addNote: (note: Omit<Note, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>
  updateNote: (id: number, note: Partial<Note>) => Promise<void>
  deleteNote: (id: number) => Promise<void>
  getPinnedNotes: () => Note[]
  getDiaryEntries: () => Note[]
  getGratitudeEntries: () => Note[]
  isLoading: boolean
}

const NoteContext = createContext<NoteContextType | undefined>(undefined)

export function NoteProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Carregar notas do usuário
  useEffect(() => {
    if (user) {
      loadNotes()
    }
  }, [user])

  const loadNotes = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/notes?userId=${user.id}`)
      
      if (response.ok) {
        const notesData = await response.json()
        setNotes(notesData)
      } else {
        console.error('Erro ao carregar notas')
      }
    } catch (error) {
      console.error('Erro ao carregar notas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addNote = async (noteData: Omit<Note, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...noteData,
          userId: user.id,
        }),
      })

      if (response.ok) {
        const newNote = await response.json()
        setNotes(prev => [...prev, newNote])
      } else {
        console.error('Erro ao adicionar nota')
      }
    } catch (error) {
      console.error('Erro ao adicionar nota:', error)
    }
  }

  const updateNote = async (id: number, noteData: Partial<Note>) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      })

      if (response.ok) {
        const updatedNote = await response.json()
        setNotes(prev => prev.map(note => note.id === id ? updatedNote : note))
      } else {
        console.error('Erro ao atualizar nota')
      }
    } catch (error) {
      console.error('Erro ao atualizar nota:', error)
    }
  }

  const deleteNote = async (id: number) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNotes(prev => prev.filter(note => note.id !== id))
      } else {
        console.error('Erro ao deletar nota')
      }
    } catch (error) {
      console.error('Erro ao deletar nota:', error)
    }
  }

  const getPinnedNotes = () => {
    return notes.filter((note) => note.pinned && note.type === "general")
  }

  const getDiaryEntries = () => {
    return notes.filter((note) => note.type === "diary")
  }

  const getGratitudeEntries = () => {
    return notes.filter((note) => note.type === "gratitude")
  }

  return (
    <NoteContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        getPinnedNotes,
        getDiaryEntries,
        getGratitudeEntries,
        isLoading,
      }}
    >
      {children}
    </NoteContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NoteContext)
  if (context === undefined) {
    throw new Error("useNotes must be used within a NoteProvider")
  }
  return context
} 