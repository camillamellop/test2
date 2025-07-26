"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context-prisma"

interface Document {
  id: number
  title: string
  description?: string
  fileName: string
  fileUrl: string
  fileType: "pdf" | "doc" | "docx" | "image"
  fileSize: number
  category: "contract" | "proposal" | "invoice" | "other"
  projectId?: number
  userId: number
  createdAt: Date
  updatedAt: Date
  project?: {
    id: number
    title: string
  }
}

interface DocumentContextType {
  documents: Document[]
  addDocument: (document: Omit<Document, "id" | "userId" | "createdAt" | "updatedAt" | "project">) => Promise<void>
  updateDocument: (id: number, document: Partial<Document>) => Promise<void>
  deleteDocument: (id: number) => Promise<void>
  getDocumentsForProject: (projectId: number) => Document[]
  getDocumentsByCategory: (category: Document["category"]) => Document[]
  isLoading: boolean
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Carregar documentos do usuário
  useEffect(() => {
    if (user) {
      loadDocuments()
    }
  }, [user])

  const loadDocuments = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/documents?userId=${user.id}`)
      
      if (response.ok) {
        const documentsData = await response.json()
        setDocuments(documentsData)
      } else {
        console.error('Erro ao carregar documentos')
      }
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addDocument = async (documentData: Omit<Document, "id" | "userId" | "createdAt" | "updatedAt" | "project">) => {
    if (!user) return
    
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...documentData,
          userId: user.id
        }),
      })

      if (response.ok) {
        const newDocument = await response.json()
        setDocuments((prev) => [newDocument, ...prev])
      } else {
        console.error('Erro ao criar documento')
      }
    } catch (error) {
      console.error('Erro ao adicionar documento:', error)
    }
  }

  const updateDocument = async (id: number, documentData: Partial<Document>) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      })

      if (response.ok) {
        const updatedDocument = await response.json()
        setDocuments((prev) => 
          prev.map((doc) => 
            doc.id === id ? updatedDocument : doc
          )
        )
      } else {
        console.error('Erro ao atualizar documento')
      }
    } catch (error) {
      console.error('Erro ao atualizar documento:', error)
    }
  }

  const deleteDocument = async (id: number) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id))
      } else {
        console.error('Erro ao deletar documento')
      }
    } catch (error) {
      console.error('Erro ao deletar documento:', error)
    }
  }

  const getDocumentsForProject = (projectId: number) => {
    return documents.filter((doc) => doc.projectId === projectId)
  }

  const getDocumentsByCategory = (category: Document["category"]) => {
    return documents.filter((doc) => doc.category === category)
  }

  return (
    <DocumentContext.Provider
      value={{
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        getDocumentsForProject,
        getDocumentsByCategory,
        isLoading,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider")
  }
  return context
} 