"use client"

import { useState, useRef } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, X, Upload, FileText, Download, Trash2, Share2 } from "lucide-react"
import { useDocuments } from "@/contexts/document-context-prisma"
import { useProjects } from "@/contexts/project-context-prisma"
import { useAuth } from "@/contexts/auth-context-prisma"
import { useNotifications } from "@/contexts/notification-context-prisma"
import { Badge } from "@/components/ui/badge"
import { UserSelectionSheet } from "./user-selection-sheet"

interface DocumentSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedProjectId?: number
}

export function DocumentSheet({ isOpen, onClose, selectedProjectId }: DocumentSheetProps) {
  const { addDocument, documents, deleteDocument } = useDocuments()
  const { projects } = useProjects()
  const { user } = useAuth()
  const { createNotification } = useNotifications()
  const [showUserSelection, setShowUserSelection] = useState(false)
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<"contract" | "proposal" | "invoice" | "other">("contract")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: "contract", label: "Contrato" },
    { value: "proposal", label: "Proposta" },
    { value: "invoice", label: "Fatura/Nota Fiscal" },
    { value: "other", label: "Outro" },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"]
      if (!allowedTypes.includes(file.type)) {
        alert("Por favor, selecione apenas arquivos PDF, DOC, DOCX ou imagens.")
        return
      }

      // Validar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("O arquivo deve ter no máximo 10MB.")
        return
      }

      setSelectedFile(file)
      // Criar URL temporária para preview
      const url = URL.createObjectURL(file)
      setFileUrl(url)
    }
  }

  const removeFile = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
    }
    setSelectedFile(null)
    setFileUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      alert("Por favor, selecione um arquivo.")
      return
    }

    if (!title.trim()) {
      alert("Por favor, insira um título para o documento.")
      return
    }

    try {
      // Determinar o tipo de arquivo
      let fileType: "pdf" | "doc" | "docx" | "image" = "pdf"
      if (selectedFile.type === "application/msword") fileType = "doc"
      else if (selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") fileType = "docx"
      else if (selectedFile.type.startsWith("image/")) fileType = "image"

      await addDocument({
        projectId: selectedProjectId,
        title: title.trim(),
        description: description.trim() || undefined,
        fileName: selectedFile.name,
        fileUrl: fileUrl, // Em produção, seria o URL do servidor
        fileType,
        fileSize: selectedFile.size,
        category,
      })

      // Limpar formulário
      setTitle("")
      setDescription("")
      setCategory("contract")
      removeFile()
      onClose()
    } catch (error) {
      console.error("Erro ao adicionar documento:", error)
      alert("Erro ao adicionar documento. Tente novamente.")
    }
  }

  const handleDelete = (documentId: number) => {
    if (confirm("Tem certeza que deseja excluir este documento?")) {
      deleteDocument(documentId)
    }
  }

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return "📄"
      case "doc":
      case "docx":
        return "📝"
      case "image":
        return "🖼️"
      default:
        return "📄"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleShareDocument = (documentId: number) => {
    setSelectedDocumentId(documentId)
    setShowUserSelection(true)
  }

  const handleUserSelection = async (selectedUserIds: number[]) => {
    if (!selectedDocumentId) return

    const document = documents.find(d => d.id === selectedDocumentId)
    if (!document) return

    // Criar notificações para os usuários
    for (const userId of selectedUserIds) {
      await createNotification({
        title: "Documento compartilhado",
        message: `${document.title} foi compartilhado com você`,
        type: "event_share",
        isRead: false,
      })
    }

    setSelectedDocumentId(null)
    setShowUserSelection(false)
  }

  const isAdmin = user?.role === "admin"

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Gerenciar Documentos</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Formulário para adicionar novo documento */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-orange-400">Adicionar Novo Documento</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Documento</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="glass-input"
                  placeholder="Ex: Contrato de Show"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input"
                  placeholder="Descrição do documento..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-white">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProjectId && (
                <div>
                  <Label>Projeto Associado</Label>
                  <div className="glass-input p-3">
                    {projects.find(p => p.id === selectedProjectId)?.title || "Projeto não encontrado"}
                  </div>
                </div>
              )}

              {/* Upload de arquivo */}
              <div>
                <Label htmlFor="file">Arquivo (PDF, DOC, DOCX, JPG, PNG)</Label>
                {!selectedFile ? (
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full glass-button border-dashed border-2 border-orange-400/50 hover:border-orange-400"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Selecionar arquivo
                    </Button>
                  </div>
                ) : (
                  <div className="mt-2 p-3 bg-gray-700 rounded-lg border border-orange-400/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-orange-400" />
                        <span className="text-sm">{selectedFile.name}</span>
                        <span className="text-xs text-gray-400">({formatFileSize(selectedFile.size)})</span>
                      </div>
                      <Button
                        type="button"
                        onClick={removeFile}
                        className="h-6 w-6 text-red-400 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" disabled={!selectedFile || !title.trim()} className="w-full orange-button">
                <Save className="w-4 h-4 mr-2" />
                Adicionar Documento
              </Button>
            </form>
          </div>

          {/* Lista de documentos existentes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-orange-400">Documentos Existentes</h3>
            
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p>Nenhum documento adicionado ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="glass-card p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getFileTypeIcon(doc.fileType)}</span>
                          <h4 className="font-medium text-white">{doc.title}</h4>
                          <Badge variant="secondary" className="glass-button text-xs">
                            {categories.find(c => c.value === doc.category)?.label}
                          </Badge>
                        </div>
                        
                        {doc.description && (
                          <p className="text-sm text-gray-400 mb-2">{doc.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{doc.fileName}</span>
                          <span>{formatFileSize(doc.fileSize)}</span>
                          <span>{new Date(doc.createdAt).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-400 hover:text-green-300"
                          onClick={() => handleShareDocument(doc.id)}
                          title="Compartilhar documento"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-400 hover:text-blue-300"
                          onClick={() => { alert(`Visualizando: ${doc.fileName}`) }}
                          title="Visualizar documento"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(doc.id)}
                          title="Excluir documento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>

      {showUserSelection && (
        <UserSelectionSheet
          isOpen={showUserSelection}
          onClose={() => {
            setShowUserSelection(false)
            setSelectedDocumentId(null)
          }}
          onConfirm={handleUserSelection}
          title={isAdmin ? "Compartilhar com DJs" : "Compartilhar com Admin"}
          description={isAdmin ? "Selecione os DJs para compartilhar o documento" : "Compartilhar documento com o administrador"}
          filterRole={isAdmin ? "dj" : "admin"}
        />
      )}
    </Sheet>
  )
} 