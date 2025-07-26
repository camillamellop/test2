"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useProjects } from "@/contexts/project-context-prisma"

interface ProjectSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSheet({ isOpen, onClose }: ProjectSheetProps) {
  const { addProject } = useProjects()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    deadline: "",
  })

  const categories = [
    { value: "branding", label: "Branding" },
    { value: "dj-music", label: "DJ/Música" },
    { value: "instagram", label: "Instagram" },
    { value: "other", label: "Outros" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await addProject({
      title: formData.title,
      description: formData.description,
      category: formData.category as any,
      status: "active",
      progress: 0,
      deadline: formData.deadline || undefined,
    })

    setFormData({
      title: "",
      description: "",
      category: "",
      deadline: "",
    })

    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-gray-800 border-gray-700 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Novo Projeto</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <Label htmlFor="title">Título do Projeto</Label>
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
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="text-white">
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deadline">Prazo</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                className="glass-input"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="orange-button flex-1">
              Criar Projeto
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
