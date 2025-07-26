"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Trash2, Save, X, Share2 } from "lucide-react"
import { useNotes } from "@/contexts/note-context-prisma"
import { useAuth } from "@/contexts/auth-context-prisma"
import { useNotifications } from "@/contexts/notification-context-prisma"
import { UserSelectionSheet } from "./user-selection-sheet"

interface NoteSheetProps {
  isOpen: boolean
  onClose: () => void
  noteId?: number
}

export function NoteSheet({ isOpen, onClose, noteId }: NoteSheetProps) {
  const { notes, addNote, updateNote, deleteNote } = useNotes()
  const { user } = useAuth()
  const { createNotification } = useNotifications()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [pinned, setPinned] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showUserSelection, setShowUserSelection] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)

  const note = noteId ? notes.find((n) => n.id === noteId) : null

  useEffect(() => {
    if (note) {
      setTitle(note.title || "")
      setContent(note.content)
      setPinned(note.pinned)
      setIsEditing(true)
    } else {
      setTitle("")
      setContent("")
      setPinned(false)
      setIsEditing(false)
    }
  }, [note, isOpen])

  const handleSave = async () => {
    if (!content.trim()) return

    if (isEditing && note) {
      await updateNote(note.id, {
        title: title.trim() || undefined,
        content: content.trim(),
        pinned,
      })
    } else {
      await addNote({
        title: title.trim() || undefined,
        content: content.trim(),
        type: "general",
        pinned,
        date: new Date().toISOString().split("T")[0],
      })
    }

    handleClose()
  }

  const handleDelete = async () => {
    if (note) {
      await deleteNote(note.id)
      handleClose()
    }
  }

  const handleClose = () => {
    setTitle("")
    setContent("")
    setPinned(false)
    setIsEditing(false)
    onClose()
  }

  const handleShareNote = (noteId: number) => {
    setSelectedNoteId(noteId)
    setShowUserSelection(true)
  }

  const handleUserSelection = async (selectedUserIds: number[]) => {
    if (!selectedNoteId) return

    const note = notes.find(n => n.id === selectedNoteId)
    if (!note) return

    // Criar notificações para os usuários
    for (const userId of selectedUserIds) {
      await createNotification({
        title: "Nota compartilhada",
        message: `${note.title || 'Nota sem título'} foi compartilhada com você`,
        type: "event_share",
        isRead: false,
      })
    }

    setSelectedNoteId(null)
    setShowUserSelection(false)
  }

  const isAdmin = user?.role === "admin"

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="glass-card border-l border-blue-400/30">
        <SheetHeader>
          <SheetTitle className="text-white">
            {isEditing ? "Editar Nota" : "Nova Nota"}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Título (opcional)
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da nota..."
              className="glass-input"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-white">
              Conteúdo *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite sua nota..."
              className="glass-input min-h-[120px] resize-none"
            />
          </div>

          {/* Pinned */}
          <div className="flex items-center justify-between">
            <Label htmlFor="pinned" className="text-white">
              Fixar nota
            </Label>
            <Switch
              id="pinned"
              checked={pinned}
              onCheckedChange={setPinned}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {isEditing && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleShareNote(note!.id)}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Apagar
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!content.trim()}
              className="flex-1 glass-button"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </SheetContent>

      {showUserSelection && (
        <UserSelectionSheet
          isOpen={showUserSelection}
          onClose={() => {
            setShowUserSelection(false)
            setSelectedNoteId(null)
          }}
          onConfirm={handleUserSelection}
          title={isAdmin ? "Compartilhar com DJs" : "Compartilhar com Admin"}
          description={isAdmin ? "Selecione os DJs para compartilhar a nota" : "Compartilhar nota com o administrador"}
          filterRole={isAdmin ? "dj" : "admin"}
        />
      )}
    </Sheet>
  )
} 