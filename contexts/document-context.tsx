"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface Document {
  id: number
  projectId?: number
  title: string
  description?: string
  fileName: string
  fileUrl: string
  fileType: "pdf" | "doc" | "docx" | "image"
  fileSize: number
  uploadDate: string
  category: "contract" | "proposal" | "invoice" | "other"
}

interface DocumentContextType {
  documents: Document[]
  addDocument: (document: Omit<Document, "id" | "uploadDate">) => Promise<void>
  updateDocument: (id: number, document: Partial<Document>) => Promise<void>
  deleteDocument: (id: number) => Promise<void>
  getDocumentsForProject: (projectId: number) => Document[]
  getDocumentsByCategory: (category: Document["category"]) => Document[]
  isLoading: boolean
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      title: "Contrato de Show - Festa de Aniversário",
      description: "Contrato para show de aniversário em 15/12/2024",
      fileName: "contrato-show-aniversario.pdf",
      fileUrl: "/documents/contrato-show-aniversario.pdf",
      fileType: "pdf",
      fileSize: 245760,
      uploadDate: new Date().toISOString().split("T")[0],
      category: "contract",
    },
    {
      id: 2,
      title: "Proposta Comercial - Evento Corporativo",
      description: "Proposta para evento corporativo de fim de ano",
      fileName: "proposta-evento-corporativo.docx",
      fileUrl: "/documents/proposta-evento-corporativo.docx",
      fileType: "docx",
      fileSize: 512000,
      uploadDate: new Date().toISOString().split("T")[0],
      category: "proposal",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const addDocument = async (documentData: Omit<Document, "id" | "uploadDate">) => {
    const newDocument: Document = {
      ...documentData,
      id: Date.now(),
      uploadDate: new Date().toISOString().split("T")[0],
    }
    setDocuments((prev) => [...prev, newDocument])
  }

  const updateDocument = async (id: number, documentData: Partial<Document>) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...documentData } : doc)))
  }

  const deleteDocument = async (id: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
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