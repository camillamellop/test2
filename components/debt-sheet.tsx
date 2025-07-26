"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useFinance } from "@/contexts/finance-context"

interface DebtSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function DebtSheet({ isOpen, onClose }: DebtSheetProps) {
  const { addDebt } = useFinance()
  const [formData, setFormData] = useState({
    description: "",
    totalAmount: "",
    remainingAmount: "",
    monthlyPayment: "",
    creditor: "",
    dueDate: "",
    interestRate: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await addDebt({
      description: formData.description,
      totalAmount: Number.parseFloat(formData.totalAmount),
      remainingAmount: Number.parseFloat(formData.remainingAmount || formData.totalAmount),
      monthlyPayment: Number.parseFloat(formData.monthlyPayment),
      creditor: formData.creditor,
      dueDate: formData.dueDate,
      interestRate: formData.interestRate ? Number.parseFloat(formData.interestRate) : undefined,
    })

    setFormData({
      description: "",
      totalAmount: "",
      remainingAmount: "",
      monthlyPayment: "",
      creditor: "",
      dueDate: "",
      interestRate: "",
    })

    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="glass-card border-blue-400/30 text-white max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Nova Dívida</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="glass-input"
              placeholder="Ex: Financiamento do carro"
              required
            />
          </div>

          <div>
            <Label htmlFor="creditor">Credor</Label>
            <Input
              id="creditor"
              value={formData.creditor}
              onChange={(e) => handleChange("creditor", e.target.value)}
              className="glass-input"
              placeholder="Ex: Banco do Brasil"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalAmount">Valor Total (R$)</Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                value={formData.totalAmount}
                onChange={(e) => handleChange("totalAmount", e.target.value)}
                className="glass-input"
                required
              />
            </div>

            <div>
              <Label htmlFor="remainingAmount">Valor Restante (R$)</Label>
              <Input
                id="remainingAmount"
                type="number"
                step="0.01"
                value={formData.remainingAmount}
                onChange={(e) => handleChange("remainingAmount", e.target.value)}
                className="glass-input"
                placeholder="Se vazio, será igual ao valor total"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthlyPayment">Parcela Mensal (R$)</Label>
              <Input
                id="monthlyPayment"
                type="number"
                step="0.01"
                value={formData.monthlyPayment}
                onChange={(e) => handleChange("monthlyPayment", e.target.value)}
                className="glass-input"
                required
              />
            </div>

            <div>
              <Label htmlFor="interestRate">Taxa de Juros (% a.m.)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                value={formData.interestRate}
                onChange={(e) => handleChange("interestRate", e.target.value)}
                className="glass-input"
                placeholder="Opcional"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="glass-input"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 glass-button bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="orange-button flex-1">
              Adicionar Dívida
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
