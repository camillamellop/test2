"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, X } from "lucide-react"
import { useSelfCare } from "@/contexts/self-care-context-prisma"

interface SelfCareSheetProps {
  isOpen: boolean
  onClose: () => void
  type: "mood" | "sleep" | "activity" | "gratitude"
}

export function SelfCareSheet({ isOpen, onClose, type }: SelfCareSheetProps) {
  const { addEntry } = useSelfCare()
  const [value, setValue] = useState("")
  const [notes, setNotes] = useState("")

  const getTypeConfig = () => {
    switch (type) {
      case "mood":
        return {
          title: "Registrar Humor",
          description: "Como você se sente hoje?",
          options: [
            { value: "😊 Ótimo", label: "😊 Ótimo" },
            { value: "🙂 Bom", label: "🙂 Bom" },
            { value: "😐 Normal", label: "😐 Normal" },
            { value: "😔 Ruim", label: "😔 Ruim" },
            { value: "😢 Muito Ruim", label: "😢 Muito Ruim" },
          ],
        }
      case "sleep":
        return {
          title: "Registrar Sono",
          description: "Quantas horas você dormiu?",
          options: [
            { value: "4h", label: "4 horas ou menos" },
            { value: "5h", label: "5 horas" },
            { value: "6h", label: "6 horas" },
            { value: "7h", label: "7 horas" },
            { value: "8h", label: "8 horas" },
            { value: "9h", label: "9 horas ou mais" },
          ],
        }
      case "activity":
        return {
          title: "Registrar Atividade",
          description: "Manteve seu corpo ativo?",
          options: [
            { value: "Sim, exercício intenso", label: "Sim, exercício intenso" },
            { value: "Sim, exercício leve", label: "Sim, exercício leve" },
            { value: "Sim, caminhada", label: "Sim, caminhada" },
            { value: "Não, sedentário", label: "Não, sedentário" },
          ],
        }
      case "gratitude":
        return {
          title: "Registrar Gratidão",
          description: "Pelo que você é grato hoje?",
          options: [],
        }
      default:
        return { title: "", description: "", options: [] }
    }
  }

  const config = getTypeConfig()

  useEffect(() => {
    if (isOpen) {
      setValue("")
      setNotes("")
    }
  }, [isOpen, type])

  const handleSave = async () => {
    if (!value.trim()) return

    await addEntry({
      type,
      value: value.trim(),
      date: new Date().toISOString().split("T")[0],
    })

    handleClose()
  }

  const handleClose = () => {
    setValue("")
    setNotes("")
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="glass-card border-l border-blue-400/30">
        <SheetHeader>
          <SheetTitle className="text-white">{config.title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Description */}
          <p className="text-gray-300 text-sm">{config.description}</p>

          {/* Value Selection */}
          {type === "gratitude" ? (
            <div className="space-y-2">
              <Label htmlFor="gratitude" className="text-white">
                Pelo que você é grato hoje?
              </Label>
              <Textarea
                id="gratitude"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ex: Pela saúde, pela família, pelo trabalho..."
                className="glass-input min-h-[100px] resize-none"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-white">Selecione uma opção:</Label>
              <Select value={value} onValueChange={setValue}>
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Escolha uma opção" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {config.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">
              Observações (opcional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações..."
              className="glass-input min-h-[80px] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
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
              disabled={!value.trim()}
              className="flex-1 glass-button"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 