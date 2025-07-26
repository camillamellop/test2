"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { useFinance } from "@/contexts/finance-context"

interface FixedExpenseSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function FixedExpenseSheet({ isOpen, onClose }: FixedExpenseSheetProps) {
  const { addFixedExpense } = useFinance()
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    dueDay: "",
    isActive: true,
  })

  const categories = [
    "Aluguel",
    "Financiamento",
    "Internet",
    "Telefone",
    "Energia",
    "Água",
    "Streaming",
    "Academia",
    "Seguro",
    "Outros",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await addFixedExpense({
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      dueDay: Number.parseInt(formData.dueDay),
      isActive: formData.isActive,
    })

    setFormData({
      description: "",
      amount: "",
      category: "",
      dueDay: "",
      isActive: true,
    })

    onClose()
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="glass-card border-blue-400/30 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Nova Despesa Fixa</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="glass-input"
              placeholder="Ex: Aluguel do apartamento"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className="glass-input"
                required
              />
            </div>

            <div>
              <Label htmlFor="dueDay">Dia do Vencimento</Label>
              <Select value={formData.dueDay} onValueChange={(value) => handleChange("dueDay", value)}>
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Dia" />
                </SelectTrigger>
                <SelectContent className="glass-card border-blue-400/30">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()} className="text-white">
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="glass-card border-blue-400/30">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange("isActive", checked)}
            />
            <Label htmlFor="isActive">Despesa ativa</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 glass-button bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="orange-button flex-1">
              Adicionar Despesa Fixa
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
