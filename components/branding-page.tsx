"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context-prisma"
import { useNotifications } from "@/contexts/notification-context-prisma"
import { useBranding } from "@/contexts/branding-context-prisma"
import { TopHeader } from "./top-header"
import { BottomNavigation } from "./bottom-navigation"
import { UserSelectionSheet } from "./user-selection-sheet"
import { Share2, Users, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BrandingPage() {
  const { user } = useAuth()
  const { createNotification } = useNotifications()
  const { userBranding, createBranding, updateBranding, isLoading } = useBranding()
  const [formData, setFormData] = useState({
    mission: "",
    vision: "",
    values: "",
    voiceTone: "",
    characteristics: "",
    targetAudience: "",
  })
  const [showUserSelection, setShowUserSelection] = useState(false)
  const [showDJSelection, setShowDJSelection] = useState(false)
  const [selectedDJId, setSelectedDJId] = useState<number | null>(null)

  const isAdmin = user?.role === "admin"

  // Removido o useEffect que chamava loadUserBranding - agora é carregado automaticamente pelo contexto

  useEffect(() => {
    if (userBranding) {
      setFormData({
        mission: userBranding.mission || "",
        vision: userBranding.vision || "",
        values: userBranding.values || "",
        voiceTone: userBranding.voiceTone || "",
        characteristics: userBranding.characteristics || "",
        targetAudience: userBranding.targetAudience || "",
      })
    }
  }, [userBranding])

  const handleSave = async () => {
    if (!user) return

    try {
      if (userBranding) {
        // Atualizar branding existente
        await updateBranding(userBranding.id, formData)
      } else {
        // Criar novo branding
        await createBranding({
          ...formData,
          userId: user.id,
          createdBy: user.id,
        })
      }
    } catch (error) {
      console.error("Erro ao salvar branding:", error)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleShareBranding = () => {
    setShowUserSelection(true)
  }

  const handleCreateForDJ = () => {
    setShowDJSelection(true)
  }

  const handleUserSelection = async (selectedUserIds: number[]) => {
    // Criar notificações para os usuários
    for (const userId of selectedUserIds) {
      await createNotification({
        title: "Branding compartilhado",
        message: `${user?.name || 'Usuário'} compartilhou seu branding pessoal com você`,
        type: "event_share",
        isRead: false,
      })
    }

    setShowUserSelection(false)
  }

  const handleDJSelection = async (selectedUserIds: number[]) => {
    if (selectedUserIds.length === 0) return

    const djId = selectedUserIds[0] // Pegar apenas o primeiro DJ selecionado
    setSelectedDJId(djId)
    setShowDJSelection(false)
  }

  const handleCreateBrandingForDJ = async () => {
    if (!selectedDJId || !user) return

    try {
      await createBranding({
        ...formData,
        userId: selectedDJId,
        createdBy: user.id,
      })

      // Notificar o DJ
      await createNotification({
        title: "Branding criado",
        message: `${user.name} criou um branding personalizado para você`,
        type: "event_share",
        isRead: false,
      })

      setSelectedDJId(null)
      setFormData({
        mission: "",
        vision: "",
        values: "",
        voiceTone: "",
        characteristics: "",
        targetAudience: "",
      })
    } catch (error) {
      console.error("Erro ao criar branding para DJ:", error)
    }
  }

  return (
    <div className="min-h-screen text-white relative">
      {/* Animated background particles */}
      <div className="bg-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <TopHeader />

      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Branding Pessoal</h1>
          <p className="text-gray-400">
            Defina sua identidade e valores como artista
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleShareBranding}
          >
            <Share2 className="w-4 h-4" />
            Compartilhar
          </Button>

          {isAdmin && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCreateForDJ}
            >
              <Users className="w-4 h-4" />
              Criar para DJ
            </Button>
          )}

          <Button
            className="flex items-center gap-2"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>

        {/* Branding Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Missão</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Qual é a sua missão como artista?"
                value={formData.mission}
                onChange={(e) => handleChange("mission", e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Visão</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Onde você quer chegar?"
                value={formData.vision}
                onChange={(e) => handleChange("vision", e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Quais são os seus valores fundamentais?"
                value={formData.values}
                onChange={(e) => handleChange("values", e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Tom de Voz</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Como você se comunica?"
                value={formData.voiceTone}
                onChange={(e) => handleChange("voiceTone", e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Características</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="O que te torna único?"
                value={formData.characteristics}
                onChange={(e) => handleChange("characteristics", e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Público-Alvo</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Quem é o seu público?"
                value={formData.targetAudience}
                onChange={(e) => handleChange("targetAudience", e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />

      {/* Modals */}
      <UserSelectionSheet
        isOpen={showUserSelection}
        onClose={() => setShowUserSelection(false)}
        onConfirm={handleUserSelection}
        title="Compartilhar Branding"
        description="Selecione os usuários com quem deseja compartilhar seu branding:"
      />

      <UserSelectionSheet
        isOpen={showDJSelection}
        onClose={() => setShowDJSelection(false)}
        onConfirm={handleDJSelection}
        title="Criar Branding para DJ"
        description="Selecione o DJ para quem deseja criar um branding:"
      />
    </div>
  )
}
