"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface Transaction {
  id: number
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
  receipt?: string // URL do comprovante
  assignedTo?: number // DJ para quem a receita foi atribuída
  createdBy?: number // Quem criou a transação
}

interface FixedExpense {
  id: number
  description: string
  amount: number
  category: string
  dueDay: number // Dia do mês que vence
  isActive: boolean
}

interface Debt {
  id: number
  description: string
  totalAmount: number
  remainingAmount: number
  monthlyPayment: number
  dueDate: string
  creditor: string
  interestRate?: number
}

interface FinanceContextType {
  transactions: Transaction[]
  fixedExpenses: FixedExpense[]
  debts: Debt[]
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>
  deleteTransaction: (id: number) => Promise<void>
  addFixedExpense: (expense: Omit<FixedExpense, "id">) => Promise<void>
  updateFixedExpense: (id: number, expense: Partial<FixedExpense>) => Promise<void>
  deleteFixedExpense: (id: number) => Promise<void>
  addDebt: (debt: Omit<Debt, "id">) => Promise<void>
  updateDebt: (id: number, debt: Partial<Debt>) => Promise<void>
  deleteDebt: (id: number) => Promise<void>
  getTotalBalance: () => number
  getTotalIncome: () => number
  getTotalExpenses: () => number
  getTotalFixedExpenses: () => number
  getTotalDebts: () => number
  isLoading: boolean
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: "income",
      amount: 1500.00,
      description: "Cachê Show",
      category: "Cachê",
      date: new Date().toISOString().split("T")[0],
    },
    {
      id: 2,
      type: "expense",
      amount: 250.00,
      description: "Cabo de Guitarra",
      category: "Equipamentos",
      date: new Date().toISOString().split("T")[0],
    },
    {
      id: 3,
      type: "income",
      amount: 800.00,
      description: "Aula de Música",
      category: "Aulas",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Ontem
    },
  ])
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([
    {
      id: 1,
      description: "Spotify Premium",
      amount: 19.90,
      category: "Streaming",
      dueDay: 15,
      isActive: true,
    },
    {
      id: 2,
      description: "Aluguel do Estúdio",
      amount: 500.00,
      category: "Equipamentos",
      dueDay: 5,
      isActive: true,
    },
  ])
  const [debts, setDebts] = useState<Debt[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addTransaction = async (transactionData: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now(),
    }
    setTransactions((prev) => [...prev, newTransaction])
  }

  const deleteTransaction = async (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const addFixedExpense = async (expenseData: Omit<FixedExpense, "id">) => {
    const newExpense: FixedExpense = {
      ...expenseData,
      id: Date.now(),
    }
    setFixedExpenses((prev) => [...prev, newExpense])
  }

  const updateFixedExpense = async (id: number, expenseData: Partial<FixedExpense>) => {
    setFixedExpenses((prev) => prev.map((expense) => (expense.id === id ? { ...expense, ...expenseData } : expense)))
  }

  const deleteFixedExpense = async (id: number) => {
    setFixedExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const addDebt = async (debtData: Omit<Debt, "id">) => {
    const newDebt: Debt = {
      ...debtData,
      id: Date.now(),
    }
    setDebts((prev) => [...prev, newDebt])
  }

  const updateDebt = async (id: number, debtData: Partial<Debt>) => {
    setDebts((prev) => prev.map((debt) => (debt.id === id ? { ...debt, ...debtData } : debt)))
  }

  const deleteDebt = async (id: number) => {
    setDebts((prev) => prev.filter((debt) => debt.id !== id))
  }

  const getTotalIncome = () => {
    return transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalExpenses = () => {
    return transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalFixedExpenses = () => {
    return fixedExpenses.filter((e) => e.isActive).reduce((sum, e) => sum + e.amount, 0)
  }

  const getTotalDebts = () => {
    return debts.reduce((sum, d) => sum + d.remainingAmount, 0)
  }

  const getTotalBalance = () => {
    return getTotalIncome() - getTotalExpenses()
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        fixedExpenses,
        debts,
        addTransaction,
        deleteTransaction,
        addFixedExpense,
        updateFixedExpense,
        deleteFixedExpense,
        addDebt,
        updateDebt,
        deleteDebt,
        getTotalBalance,
        getTotalIncome,
        getTotalExpenses,
        getTotalFixedExpenses,
        getTotalDebts,
        isLoading,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}
