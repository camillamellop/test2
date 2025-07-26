"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface Note {
  id: number
  title?: string
  content: string
  type: "general" | "diary" | "gratitude"
  pinned: boolean
  date: string
}

interface NoteContextType {
  notes: Note[]
  addNote: (note: Omit<Note, "id">) => Promise<void>
  updateNote: (id: number, note: Partial<Note>) => Promise<void>
  deleteNote: (id: number) => Promise<void>
  getPinnedNotes: () => Note[]
  getDiaryEntries: () => Note[]
  getGratitudeEntries: () => Note[]
  isLoading: boolean
}

const NoteContext = createContext<NoteContextType | undefined>(undefined)

export function NoteProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Ideia para próxima música",
      content: "Explorar ritmos africanos com elementos eletrônicos",
      type: "general",
      pinned: true,
      date: new Date().toISOString().split("T")[0],
    },
    {
      id: 2,
      title: "Lembrete importante",
      content: "Finalizar mixagem do álbum até sexta-feira",
      type: "general",
      pinned: true,
      date: new Date().toISOString().split("T")[0],
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const addNote = async (noteData: Omit<Note, "id">) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now(),
    }
    setNotes((prev) => [...prev, newNote])
  }

  const updateNote = async (id: number, noteData: Partial<Note>) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, ...noteData } : note)))
  }

  const deleteNote = async (id: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
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
