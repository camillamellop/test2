"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context-prisma"

interface Transaction {
  id: number
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
  receipt?: string
  assignedTo?: number
  createdBy?: number
  userId: number
  createdAt: Date
  updatedAt: Date
}

interface FixedExpense {
  id: number
  description: string
  amount: number
  category: string
  dueDay: number
  isActive: boolean
  userId: number
  createdAt: Date
  updatedAt: Date
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
  userId: number
  createdAt: Date
  updatedAt: Date
}

interface FinanceContextType {
  transactions: Transaction[]
  fixedExpenses: FixedExpense[]
  debts: Debt[]
  addTransaction: (transaction: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>
  deleteTransaction: (id: number) => Promise<void>
  addFixedExpense: (expense: Omit<FixedExpense, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>
  updateFixedExpense: (id: number, expense: Partial<FixedExpense>) => Promise<void>
  deleteFixedExpense: (id: number) => Promise<void>
  addDebt: (debt: Omit<Debt, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>
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
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([])
  const [debts, setDebts] = useState<Debt[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Carregar dados financeiros do usuário
  useEffect(() => {
    if (user) {
      loadFinanceData()
    }
  }, [user])

  const loadFinanceData = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      
      // Carregar transações
      const transactionsResponse = await fetch(`/api/transactions?userId=${user.id}`)
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        // Converter amount para number para garantir compatibilidade
        const processedTransactions = transactionsData.map((transaction: any) => ({
          ...transaction,
          amount: Number(transaction.amount)
        }))
        setTransactions(processedTransactions)
      }

      // Carregar despesas fixas
      const fixedExpensesResponse = await fetch(`/api/fixed-expenses?userId=${user.id}`)
      if (fixedExpensesResponse.ok) {
        const fixedExpensesData = await fixedExpensesResponse.json()
        // Converter amount para number para garantir compatibilidade
        const processedFixedExpenses = fixedExpensesData.map((expense: any) => ({
          ...expense,
          amount: Number(expense.amount)
        }))
        setFixedExpenses(processedFixedExpenses)
      }

      // Carregar dívidas
      const debtsResponse = await fetch(`/api/debts?userId=${user.id}`)
      if (debtsResponse.ok) {
        const debtsData = await debtsResponse.json()
        // Converter valores monetários para number para garantir compatibilidade
        const processedDebts = debtsData.map((debt: any) => ({
          ...debt,
          totalAmount: Number(debt.totalAmount),
          remainingAmount: Number(debt.remainingAmount),
          monthlyPayment: Number(debt.monthlyPayment),
          interestRate: debt.interestRate ? Number(debt.interestRate) : undefined
        }))
        setDebts(processedDebts)
      }
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTransaction = async (transactionData: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...transactionData,
          userId: user.id,
        }),
      })

      if (response.ok) {
        const newTransaction = await response.json()
        // Converter amount para number para garantir compatibilidade
        const processedTransaction = {
          ...newTransaction,
          amount: Number(newTransaction.amount)
        }
        setTransactions(prev => [...prev, processedTransaction])
      } else {
        console.error('Erro ao adicionar transação')
      }
    } catch (error) {
      console.error('Erro ao adicionar transação:', error)
    }
  }

  const deleteTransaction = async (id: number) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTransactions(prev => prev.filter(transaction => transaction.id !== id))
      } else {
        console.error('Erro ao deletar transação')
      }
    } catch (error) {
      console.error('Erro ao deletar transação:', error)
    }
  }

  const addFixedExpense = async (expenseData: Omit<FixedExpense, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return

    try {
      const response = await fetch('/api/fixed-expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...expenseData,
          userId: user.id,
        }),
      })

      if (response.ok) {
        const newExpense = await response.json()
        // Converter amount para number para garantir compatibilidade
        const processedExpense = {
          ...newExpense,
          amount: Number(newExpense.amount)
        }
        setFixedExpenses(prev => [...prev, processedExpense])
      } else {
        console.error('Erro ao adicionar despesa fixa')
      }
    } catch (error) {
      console.error('Erro ao adicionar despesa fixa:', error)
    }
  }

  const updateFixedExpense = async (id: number, expenseData: Partial<FixedExpense>) => {
    try {
      const response = await fetch(`/api/fixed-expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      })

      if (response.ok) {
        const updatedExpense = await response.json()
        setFixedExpenses(prev => prev.map(expense => expense.id === id ? updatedExpense : expense))
      } else {
        console.error('Erro ao atualizar despesa fixa')
      }
    } catch (error) {
      console.error('Erro ao atualizar despesa fixa:', error)
    }
  }

  const deleteFixedExpense = async (id: number) => {
    try {
      const response = await fetch(`/api/fixed-expenses/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFixedExpenses(prev => prev.filter(expense => expense.id !== id))
      } else {
        console.error('Erro ao deletar despesa fixa')
      }
    } catch (error) {
      console.error('Erro ao deletar despesa fixa:', error)
    }
  }

  const addDebt = async (debtData: Omit<Debt, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return

    try {
      const response = await fetch('/api/debts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...debtData,
          userId: user.id,
        }),
      })

      if (response.ok) {
        const newDebt = await response.json()
        setDebts(prev => [...prev, newDebt])
      } else {
        console.error('Erro ao adicionar dívida')
      }
    } catch (error) {
      console.error('Erro ao adicionar dívida:', error)
    }
  }

  const updateDebt = async (id: number, debtData: Partial<Debt>) => {
    try {
      const response = await fetch(`/api/debts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(debtData),
      })

      if (response.ok) {
        const updatedDebt = await response.json()
        setDebts(prev => prev.map(debt => debt.id === id ? updatedDebt : debt))
      } else {
        console.error('Erro ao atualizar dívida')
      }
    } catch (error) {
      console.error('Erro ao atualizar dívida:', error)
    }
  }

  const deleteDebt = async (id: number) => {
    try {
      const response = await fetch(`/api/debts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDebts(prev => prev.filter(debt => debt.id !== id))
      } else {
        console.error('Erro ao deletar dívida')
      }
    } catch (error) {
      console.error('Erro ao deletar dívida:', error)
    }
  }

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === "income" && (!t.assignedTo || t.assignedTo === user?.id))
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)
  }

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)
  }

  const getTotalFixedExpenses = () => {
    return fixedExpenses
      .filter(e => e.isActive)
      .reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0)
  }

  const getTotalDebts = () => {
    return debts.reduce((sum, d) => sum + parseFloat(d.remainingAmount.toString()), 0)
  }

  const getTotalBalance = () => {
    return getTotalIncome() - getTotalExpenses() - getTotalFixedExpenses() - getTotalDebts()
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