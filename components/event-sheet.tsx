"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useEvents } from "@/contexts/event-context-prisma"
import { useEventShares } from "@/contexts/event-share-context-prisma"
import { useNotifications } from "@/contexts/notification-context-prisma"
import { useAuth } from "@/contexts/auth-context-prisma"
import { UserSelectionSheet } from "./user-selection-sheet"
import { Share2, Users } from "lucide-react"

interface EventSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string
}

export function EventSheet({ isOpen, onClose, selectedDate }: EventSheetProps) {
  const { addEvent } = useEvents()
  const { shareEvent } = useEventShares()
  const { createNotification } = useNotifications()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    location: "",
    fee: "",
  })
  const [showUserSelection, setShowUserSelection] = useState(false)
  const [createdEventId, setCreatedEventId] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await addEvent({
      title: formData.title,
      description: formData.description,
      date: selectedDate,
      time: formData.time || undefined,
      location: formData.location || undefined,
      fee: formData.fee ? Number.parseFloat(formData.fee) : undefined,
      status: "scheduled",
    })

    // Simular ID do evento criado (em produção, seria retornado pela API)
    const eventId = Date.now()
    setCreatedEventId(eventId)
    setShowUserSelection(true)
  }

  const handleUserSelection = async (selectedUserIds: number[]) => {
    if (!createdEventId) return

    // Compartilhar evento com usuários selecionados
    await shareEvent(createdEventId, selectedUserIds)

    // Criar notificações para os usuários
    for (const userId of selectedUserIds) {
      await createNotification({
        title: "Novo evento compartilhado",
        message: `${formData.title} foi compartilhado com você`,
        type: "event_share",
        eventId: createdEventId,
        isRead: false,
      })
    }

    setFormData({
      title: "",
      description: "",
      time: "",
      location: "",
      fee: "",
    })

    setCreatedEventId(null)
    setShowUserSelection(false)
    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isAdmin = user?.role === "admin"

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-gray-800 border-gray-700 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Novo Evento</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <Label htmlFor="title">Título do Evento</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="glass-input"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="glass-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className="glass-input"
              />
            </div>

            <div>
              <Label htmlFor="fee">Cachê (R$)</Label>
              <Input
                id="fee"
                type="number"
                step="0.01"
                value={formData.fee}
                onChange={(e) => handleChange("fee", e.target.value)}
                className="glass-input"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="glass-input"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="orange-button flex-1">
              {isAdmin ? "Criar e Compartilhar" : "Criar Evento"}
            </Button>
          </div>
        </form>
      </SheetContent>

      {showUserSelection && (
        <UserSelectionSheet
          isOpen={showUserSelection}
          onClose={() => {
            setShowUserSelection(false)
            setCreatedEventId(null)
          }}
          onConfirm={handleUserSelection}
          title={isAdmin ? "Compartilhar com DJs" : "Compartilhar com Admin"}
          description={isAdmin ? "Selecione os DJs para compartilhar o evento" : "Compartilhar evento com o administrador"}
          filterRole={isAdmin ? "dj" : "admin"}
        />
      )}
    </Sheet>
  )
}
