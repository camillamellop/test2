"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useFinance } from "@/contexts/finance-context-prisma"
import { useAuth } from "@/contexts/auth-context-prisma"
import { useNotifications } from "@/contexts/notification-context-prisma"
import { useToastNotification } from "@/contexts/toast-notification-context"
import { Upload, X, FileText, Users } from "lucide-react"
import { UserSelectionSheet } from "./user-selection-sheet"

interface TransactionSheetProps {
  isOpen: boolean
  onClose: () => void
  type: "income" | "expense"
}

export function TransactionSheet({ isOpen, onClose, type }: TransactionSheetProps) {
  const { addTransaction } = useFinance()
  const { user } = useAuth()
  const { createNotification } = useNotifications()
  const { showSuccess, showInfo } = useToastNotification()
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [receiptUrl, setReceiptUrl] = useState<string>("")
  const [showUserSelection, setShowUserSelection] = useState(false)
  const [assignedToDJ, setAssignedToDJ] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = {
    income: ["Cachê", "Streaming", "Merchandising", "Aulas", "Outros"],
    expense: ["Equipamentos", "Marketing", "Transporte", "Alimentação", "Outros"],
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Verificar se é uma imagem ou PDF
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        setSelectedFile(file)
        // Criar URL temporária para preview
        const url = URL.createObjectURL(file)
        setReceiptUrl(url)
      } else {
        alert('Por favor, selecione apenas imagens (JPG, PNG) ou PDFs.')
      }
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setReceiptUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simular upload do arquivo (em produção, você faria upload para um servidor)
    let finalReceiptUrl = ""
    if (selectedFile) {
      // Em um ambiente real, você faria upload para um serviço como AWS S3, Cloudinary, etc.
      // Por enquanto, vamos simular com uma URL temporária
      finalReceiptUrl = `receipt_${Date.now()}_${selectedFile.name}`
    }

    const transactionData = {
      type,
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      receipt: finalReceiptUrl || undefined,
    }

    // Se é admin e é uma receita, mostrar seleção de DJ
    if (user?.role === "admin" && type === "income") {
      setShowUserSelection(true)
      return
    }

    // Para DJs ou despesas, criar transação normalmente
    await addTransaction(transactionData)

    // Mostrar notificação toast
    showSuccess(
      `${type === "income" ? "Receita" : "Despesa"} adicionada`,
      `${formData.description} - R$ ${formData.amount}`
    )

    setFormData({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    })
    removeFile()
    onClose()
  }

  const handleUserSelection = async (selectedUserIds: number[]) => {
    if (selectedUserIds.length === 0) return

    const djId = selectedUserIds[0] // Pegar apenas o primeiro DJ selecionado
    setAssignedToDJ(djId)
    setShowUserSelection(false)

    // Simular upload do arquivo
    let finalReceiptUrl = ""
    if (selectedFile) {
      finalReceiptUrl = `receipt_${Date.now()}_${selectedFile.name}`
    }

    // Criar transação atribuída ao DJ
    await addTransaction({
      type,
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      receipt: finalReceiptUrl || undefined,
      assignedTo: djId,
    })

    // Notificar o DJ
    const notificationMessage = selectedFile 
      ? `${formData.description} - R$ ${formData.amount} foi atribuída a você com comprovante anexado`
      : `${formData.description} - R$ ${formData.amount} foi atribuída a você`

    await createNotification({
      title: "Nova receita atribuída",
      message: notificationMessage,
      type: "event_share",
      isRead: false,
    })

    // Mostrar notificação toast para o admin
    showSuccess(
      "Receita atribuída com sucesso!",
      `${formData.description} foi atribuída ao DJ selecionado${selectedFile ? " com comprovante" : ""}`
    )

    setFormData({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    })
    removeFile()
    setAssignedToDJ(null)
    onClose()
  }

  const isAdmin = user?.role === "admin"

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-gray-800 border-gray-700 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Nova {type === "income" ? "Receita" : "Despesa"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="glass-input"
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
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="glass-input"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {categories[type].map((category) => (
                  <SelectItem key={category} value={category} className="text-white">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload de Comprovante */}
          <div>
            <Label htmlFor="receipt">
              Comprovante (opcional)
              {isAdmin && type === "income" && (
                <span className="text-xs text-blue-400 block mt-1">
                  O comprovante será enviado junto com a receita para o DJ selecionado
                </span>
              )}
            </Label>
            {!selectedFile ? (
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="receipt"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full glass-button border-dashed border-2 border-blue-400/50 hover:border-blue-400"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {type === "income" ? "Anexar comprovante de pagamento" : "Anexar comprovante"}
                  <br />
                  <span className="text-xs text-gray-400">(JPG, PNG, PDF)</span>
                </Button>
              </div>
            ) : (
              <div className="mt-2 p-3 bg-gray-800 rounded-lg border border-blue-400/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">{selectedFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                    className="h-6 w-6 text-red-400 hover:text-red-300"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                {receiptUrl && selectedFile.type.startsWith('image/') && (
                  <div className="mt-2">
                    <img 
                      src={receiptUrl} 
                      alt="Preview" 
                      className="max-w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="orange-button flex-1">
              Adicionar {type === "income" ? "Receita" : "Despesa"}
            </Button>
          </div>
        </form>
      </SheetContent>

      {showUserSelection && (
        <UserSelectionSheet
          isOpen={showUserSelection}
          onClose={() => setShowUserSelection(false)}
          onConfirm={handleUserSelection}
          title="Atribuir Receita para DJ"
          description="Selecione o DJ para atribuir esta receita"
          filterRole="dj"
        />
      )}
    </Sheet>
  )
}
