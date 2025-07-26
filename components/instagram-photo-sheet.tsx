"use client"

import { useState, useRef } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, X, Upload, Image, Download, Trash2, Calendar, Clock, Share2 } from "lucide-react"
import { useInstagram } from "@/contexts/instagram-context-prisma"
import { useProjects } from "@/contexts/project-context-prisma"
import { useAuth } from "@/contexts/auth-context-prisma"
import { useNotifications } from "@/contexts/notification-context-prisma"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserSelectionSheet } from "./user-selection-sheet"

interface InstagramPhotoSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedProjectId?: number
}

const FOLDER_OPTIONS = [
  { value: "posts", label: "Posts", icon: "📱" },
  { value: "stories", label: "Stories", icon: "📸" },
  { value: "reels", label: "Reels", icon: "🎬" },
  { value: "highlights", label: "Highlights", icon: "⭐" },
  { value: "other", label: "Outros", icon: "📁" },
]

const STATUS_OPTIONS = [
  { value: "draft", label: "Rascunho", color: "bg-gray-500" },
  { value: "scheduled", label: "Agendado", color: "bg-blue-500" },
  { value: "posted", label: "Publicado", color: "bg-green-500" },
]

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileTypeIcon(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return '🖼️'
    case 'mp4':
    case 'mov':
    case 'avi':
      return '🎥'
    default:
      return '📄'
  }
}

export function InstagramPhotoSheet({ isOpen, onClose, selectedProjectId }: InstagramPhotoSheetProps) {
  const { addPhoto, photos, deletePhoto, updatePhoto } = useInstagram()
  const { projects } = useProjects()
  const { user } = useAuth()
  const { createNotification } = useNotifications()
  const [showUserSelection, setShowUserSelection] = useState(false)
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [folder, setFolder] = useState<"posts" | "stories" | "reels" | "highlights" | "other">("posts")
  const [status, setStatus] = useState<"draft" | "scheduled" | "posted">("draft")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string>("")
  const [scheduledDate, setScheduledDate] = useState<string>("")
  const [projectId, setProjectId] = useState<string>(selectedProjectId?.toString() || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov']
      if (!validTypes.includes(file.type)) {
        alert('Por favor, selecione apenas imagens (JPG, PNG, GIF, WEBP) ou vídeos (MP4, MOV)')
        return
      }

      // Validar tamanho (máximo 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 50MB permitido.')
        return
      }

      setSelectedFile(file)
      // Simular URL de upload (em produção, seria feito upload real)
      setFileUrl(`https://example.com/uploads/${file.name}`)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFileUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !title.trim()) return

    const success = await addPhoto({
      title: title.trim(),
      description: description.trim(),
      fileName: selectedFile.name,
      fileUrl,
      fileSize: selectedFile.size,
      folder,
      status,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      projectId: projectId ? parseInt(projectId) : undefined,
    })

    if (success) {
      setTitle("")
      setDescription("")
      setFolder("posts")
      setStatus("draft")
      setScheduledDate("")
      setProjectId("")
      removeFile()
      onClose()
    }
  }

  const handleDelete = async (photoId: number) => {
    if (confirm('Tem certeza que deseja deletar esta foto?')) {
      await deletePhoto(photoId)
    }
  }

  const handleStatusChange = async (photoId: number, newStatus: "draft" | "scheduled" | "posted") => {
    await updatePhoto(photoId, { 
      status: newStatus,
      postedDate: newStatus === "posted" ? new Date() : undefined
    })
  }

  const getPhotosByFolder = (folderType: string) => {
    return photos.filter(photo => photo.folder === folderType)
  }

  const handleSharePhoto = (photoId: number) => {
    setSelectedPhotoId(photoId)
    setShowUserSelection(true)
  }

  const handleUserSelection = async (selectedUserIds: number[]) => {
    if (!selectedPhotoId) return

    const photo = photos.find(p => p.id === selectedPhotoId)
    if (!photo) return

    // Criar notificações para os usuários
    for (const userId of selectedUserIds) {
      await createNotification({
        title: "Foto do Instagram compartilhada",
        message: `${photo.title} foi compartilhada com você`,
        type: "event_share",
        isRead: false,
      })
    }

    setSelectedPhotoId(null)
    setShowUserSelection(false)
  }

  const isAdmin = user?.role === "admin"

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">📸 Gerenciar Fotos do Instagram</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="upload" className="text-white">Adicionar Foto</TabsTrigger>
              <TabsTrigger value="gallery" className="text-white">Galeria</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-orange-400">📤 Adicionar Nova Foto</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título da Foto</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Show de aniversário"
                      className="glass-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição (opcional)</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descrição da foto..."
                      className="glass-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="folder">Pasta</Label>
                      <Select value={folder} onValueChange={(value: any) => setFolder(value)}>
                        <SelectTrigger className="glass-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FOLDER_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.icon} {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                        <SelectTrigger className="glass-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <span className={`inline-block w-2 h-2 rounded-full ${option.color} mr-2`}></span>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="project">Projeto (opcional)</Label>
                    <Select value={projectId} onValueChange={setProjectId}>
                      <SelectTrigger className="glass-input">
                        <SelectValue placeholder="Selecione um projeto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Sem projeto</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {status === "scheduled" && (
                    <div>
                      <Label htmlFor="scheduledDate">Data de Agendamento</Label>
                      <Input
                        id="scheduledDate"
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="glass-input"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="file">Arquivo (JPG, PNG, GIF, WEBP, MP4, MOV)</Label>
                    {!selectedFile ? (
                      <div className="mt-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="file"
                          accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.mov"
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
                            <span className="text-lg">{getFileTypeIcon(selectedFile.name)}</span>
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

                  <Button
                    type="submit"
                    disabled={!selectedFile || !title.trim()}
                    className="w-full orange-button"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Adicionar Foto
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-orange-400">📁 Galeria de Fotos</h3>
                
                {FOLDER_OPTIONS.map((folderOption) => {
                  const folderPhotos = getPhotosByFolder(folderOption.value)
                  if (folderPhotos.length === 0) return null

                  return (
                    <div key={folderOption.value} className="space-y-3">
                      <h4 className="text-md font-medium text-gray-300">
                        {folderOption.icon} {folderOption.label} ({folderPhotos.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {folderPhotos.map((photo) => (
                          <div key={photo.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                                                         <div className="flex items-center justify-between mb-2">
                               <span className="text-lg">{getFileTypeIcon(photo.fileName)}</span>
                               <div className="flex items-center gap-1">
                                 <Button
                                   onClick={() => handleSharePhoto(photo.id)}
                                   className="h-6 w-6 text-blue-400 hover:text-blue-300"
                                   title="Compartilhar"
                                 >
                                   <Share2 className="w-3 h-3" />
                                 </Button>
                                 <Button
                                   onClick={() => handleDelete(photo.id)}
                                   className="h-6 w-6 text-red-400 hover:text-red-300"
                                   title="Deletar"
                                 >
                                   <Trash2 className="w-3 h-3" />
                                 </Button>
                               </div>
                             </div>
                            <h5 className="text-sm font-medium mb-1">{photo.title}</h5>
                            {photo.description && (
                              <p className="text-xs text-gray-400 mb-2">{photo.description}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <Badge 
                                className={`text-xs ${
                                  photo.status === 'posted' ? 'bg-green-500' :
                                  photo.status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-500'
                                }`}
                              >
                                {STATUS_OPTIONS.find(s => s.value === photo.status)?.label}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {formatFileSize(photo.fileSize)}
                              </span>
                            </div>
                            {photo.projectId && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {projects.find(p => p.id === photo.projectId)?.title}
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}

                {photos.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma foto adicionada ainda</p>
                    <p className="text-sm">Adicione sua primeira foto na aba "Adicionar Foto"</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>

      {showUserSelection && (
        <UserSelectionSheet
          isOpen={showUserSelection}
          onClose={() => {
            setShowUserSelection(false)
            setSelectedPhotoId(null)
          }}
          onConfirm={handleUserSelection}
          title={isAdmin ? "Compartilhar com DJs" : "Compartilhar com Admin"}
          description={isAdmin ? "Selecione os DJs para compartilhar a foto" : "Compartilhar foto com o administrador"}
          filterRole={isAdmin ? "dj" : "admin"}
        />
      )}
    </Sheet>
  )
} 