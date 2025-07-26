"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Heart, 
  Palette,
  Plus,
  Clock,
  Star,
  ArrowRight,
  Edit
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEvents } from "@/contexts/event-context-prisma"
import { useProjects } from "@/contexts/project-context-prisma"
import { useNotes } from "@/contexts/note-context-prisma"
import { useFinance } from "@/contexts/finance-context-prisma"
import { useAuth } from "@/contexts/auth-context-prisma"
import { TopHeader } from "./top-header"
import { BottomNavigation } from "./bottom-navigation"
import { NoteSheet } from "./note-sheet"

export function DashboardHome() {
  const router = useRouter()
  const { events } = useEvents()
  const { projects } = useProjects()
  const { notes } = useNotes()
  const { user } = useAuth()

  // Estados para modais
  const [showNoteSheet, setShowNoteSheet] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)

  const todayEvents = events.filter(event => {
    const today = new Date()
    const eventDate = new Date(event.date)
    return eventDate.toDateString() === today.toDateString()
  })

  const pinnedNotes = notes.filter((note) => note.pinned).slice(0, 3)

  // Função para obter saudação baseada no horário
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return "Bom dia"
    } else if (hour >= 12 && hour < 18) {
      return "Boa tarde"
    } else {
      return "Boa noite"
    }
  }

  // Função para obter cor baseada no horário
  const getGreetingColor = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return "text-yellow-400" // Amarelo para manhã
    } else if (hour >= 12 && hour < 18) {
      return "text-orange-400" // Laranja para tarde
    } else {
      return "text-purple-400" // Roxo para noite
    }
  }

  const greeting = getGreeting()
  const greetingColor = getGreetingColor()
  const userName = user?.name?.split(' ')[0] || ''

  // Função para editar nota
  const handleEditNote = (noteId: number) => {
    setSelectedNoteId(noteId)
    setShowNoteSheet(true)
  }

  // Função para criar nova nota
  const handleCreateNote = () => {
    setSelectedNoteId(null)
    setShowNoteSheet(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <TopHeader />
      
      <div className="p-4 pb-20 space-y-6">
        {/* Saudação Section */}
        <div className="text-center">
          <h1 className={`text-4xl font-bold ${greetingColor}`} style={{ textShadow: `0 0 20px ${greetingColor === 'text-yellow-400' ? 'rgba(251, 191, 36, 0.5)' : greetingColor === 'text-orange-400' ? 'rgba(251, 146, 60, 0.5)' : 'rgba(168, 85, 247, 0.5)'}` }}>
            {greeting}{userName ? `, ${userName}` : ''}
          </h1>
          <p className="text-gray-400 mt-2">
            Vamos criar conexões reais hoje?
          </p>
        </div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Notas Fixas */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Notas Fixas</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCreateNote}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {pinnedNotes.length > 0 ? (
                <div className="space-y-2">
                  {pinnedNotes.map((note) => (
                    <div 
                      key={note.id} 
                      className="p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                      onClick={() => handleEditNote(note.id)}
                    >
                      <h3 className="font-medium text-white">{note.title}</h3>
                      <p className="text-sm text-gray-400">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 py-4">
                    Ideia para a próxima track...
                  </p>
                  <Button
                    onClick={handleCreateNote}
                    className="glass-button"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Nota
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hoje */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              {todayEvents.length > 0 ? (
                <div className="space-y-2">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium text-white">{event.title}</h3>
                      <p className="text-sm text-gray-400">{event.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 py-4">Nenhum evento para hoje.</p>
                  <Button
                    onClick={() => router.push("/dashboard/calendar")}
                    className="glass-button"
                    size="sm"
                  >
                    Ver agenda completa
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projetos & Tarefas */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Projetos & Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <div className="space-y-2">
                  {projects.slice(0, 2).map((project) => (
                    <div key={project.id} className="p-3 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium text-white">{project.title}</h3>
                      <p className="text-sm text-gray-400">{project.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 py-4">
                    Nenhum projeto iniciado.
                  </p>
                  <Button
                    onClick={() => router.push("/dashboard/projects")}
                    className="glass-button"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Projeto
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metas dos Projetos */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Metas dos Projetos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-center py-4">
                Nenhuma meta definida nos projetos.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lembre-se Card */}
        <Card className="glass-card bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white text-center">Lembre-se</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <blockquote className="text-purple-300 italic">
              "Cuidar de si mesmo não é um luxo, é uma necessidade. Você não pode dar o seu melhor se não estiver no seu melhor."
            </blockquote>
            <Button
              onClick={() => router.push("/dashboard/self-care")}
              className="mt-4 glass-button"
              size="sm"
            >
              Ver mais
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />

      {/* Modal de Notas */}
      <NoteSheet
        isOpen={showNoteSheet}
        onClose={() => {
          setShowNoteSheet(false)
          setSelectedNoteId(null)
        }}
        noteId={selectedNoteId || undefined}
      />
    </div>
  )
}
