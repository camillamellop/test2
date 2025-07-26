"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, FileText, Target, Camera } from "lucide-react"
import { useProjects } from "@/contexts/project-context-prisma"
import { useDocuments } from "@/contexts/document-context-prisma"
import { useInstagram } from "@/contexts/instagram-context-prisma"
import { TopHeader } from "./top-header"
import { BottomNavigation } from "./bottom-navigation"
import { ProjectSheet } from "./project-sheet"
import { DocumentSheet } from "./document-sheet"
import { InstagramPhotoSheet } from "./instagram-photo-sheet"

export function ProjectsPage() {
  const { projects } = useProjects()
  const { documents } = useDocuments()
  const { photos } = useInstagram()
  const [showProjectSheet, setShowProjectSheet] = useState(false)
  const [showDocumentSheet, setShowDocumentSheet] = useState(false)
  const [showInstagramSheet, setShowInstagramSheet] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", label: "Todos", count: projects.length },
    { id: "branding", label: "Branding", count: projects.filter((p) => p.category === "branding").length },
    { id: "dj-music", label: "DJ/Música", count: projects.filter((p) => p.category === "dj-music").length },
    { id: "instagram", label: "Instagram", count: projects.filter((p) => p.category === "instagram").length },
  ]

  const filteredProjects =
    selectedCategory === "all" ? projects : projects.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen text-white relative">
      {/* Animated background particles */}
      <div className="bg-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <TopHeader />

      <div className="p-4 pb-20 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-orange-400">Projetos & Tarefas</h1>
            <p className="text-gray-400">Gerencie seus projetos de carreira e branding.</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="glass-button bg-transparent"
              onClick={() => setShowInstagramSheet(true)}
            >
              <Camera className="w-4 h-4 mr-2" />
              Fotos Instagram
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="glass-button bg-transparent"
              onClick={() => setShowDocumentSheet(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Ver Documentos
            </Button>
            <Button onClick={() => setShowProjectSheet(true)} className="orange-button" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`whitespace-nowrap ${selectedCategory === category.id ? "orange-button" : "glass-button"}`}
            >
              {category.label}
              <Badge variant="secondary" className="ml-2 glass-button">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Projects List */}
        {filteredProjects.length > 0 ? (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{project.title}</CardTitle>
                    <Badge variant="secondary" className="glass-button">
                      {project.category.replace("-", "/")}
                    </Badge>
                  </div>
                  {project.description && <p className="text-gray-400 text-sm">{project.description}</p>}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Progresso</span>
                        <span className="text-sm font-medium text-white">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 glass-progress" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge
                        variant={project.status === "active" ? "default" : "secondary"}
                        className={project.status === "active" ? "bg-green-600" : "glass-button"}
                      >
                        {project.status === "active"
                          ? "Ativo"
                          : project.status === "completed"
                            ? "Concluído"
                            : "Pausado"}
                      </Badge>

                      {project.deadline && (
                        <span className="text-sm text-gray-400">
                          Prazo: {new Date(project.deadline).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 text-white">Nenhum projeto encontrado</h3>
              <p className="text-gray-400 mb-4">
                {selectedCategory === "all"
                  ? "Comece criando um novo projeto para organizar suas tarefas."
                  : `Nenhum projeto na categoria ${categories.find((c) => c.id === selectedCategory)?.label}.`}
              </p>
              <Button onClick={() => setShowProjectSheet(true)} className="orange-button">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Projeto
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation />

      {showProjectSheet && <ProjectSheet isOpen={showProjectSheet} onClose={() => setShowProjectSheet(false)} />}
      {showDocumentSheet && <DocumentSheet isOpen={showDocumentSheet} onClose={() => setShowDocumentSheet(false)} />}
      {showInstagramSheet && <InstagramPhotoSheet isOpen={showInstagramSheet} onClose={() => setShowInstagramSheet(false)} />}
    </div>
  )
}
