"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, TrendingUp, TrendingDown, DollarSign, Calendar, CreditCard, Trash2, FileText, Eye, Users } from "lucide-react"
import { useFinance } from "@/contexts/finance-context-prisma"
import { useAuth } from "@/contexts/auth-context-prisma"
import { TopHeader } from "./top-header"
import { BottomNavigation } from "./bottom-navigation"
import { TransactionSheet } from "./transaction-sheet"
import { FixedExpenseSheet } from "./fixed-expense-sheet"
import { DebtSheet } from "./debt-sheet"

// Helper function to safely format amounts
const formatAmount = (amount: any): string => {
  const numAmount = Number(amount || 0)
  return numAmount.toFixed(2)
}

export function FinancePage() {
  const { user } = useAuth()
  const {
    transactions,
    fixedExpenses,
    debts,
    getTotalBalance,
    getTotalIncome,
    getTotalExpenses,
    getTotalFixedExpenses,
    getTotalDebts,
    deleteTransaction,
    deleteFixedExpense,
    deleteDebt,
  } = useFinance()

  const [showTransactionSheet, setShowTransactionSheet] = useState(false)
  const [showFixedExpenseSheet, setShowFixedExpenseSheet] = useState(false)
  const [showDebtSheet, setShowDebtSheet] = useState(false)
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income")

  const balance = getTotalBalance()
  const income = getTotalIncome()
  const expenses = getTotalExpenses()
  const totalFixedExpenses = getTotalFixedExpenses()
  const totalDebts = getTotalDebts()

  const handleNewTransaction = (type: "income" | "expense") => {
    setTransactionType(type)
    setShowTransactionSheet(true)
  }

  // Filtrar transações baseado no role do usuário
  const filteredTransactions = transactions.filter(transaction => {
    if (user?.role === "admin") {
      // Admin vê todas as transações
      return true
    } else {
      // DJ vê apenas suas próprias transações e transações atribuídas a ele
      return transaction.assignedTo === user?.id || !transaction.assignedTo
    }
  })

  const isAdmin = user?.role === "admin"

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
            <h1 className="text-2xl font-bold text-orange-400">Unkash</h1>
            <p className="text-gray-400">Seu centro financeiro completo.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleNewTransaction("income")} className="orange-button" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nova Receita
            </Button>
            <Button onClick={() => handleNewTransaction("expense")} variant="destructive" size="sm">
              <Minus className="w-4 h-4 mr-2" />
              Nova Despesa
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="overview" className="glass-button">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="transactions" className="glass-button">
              Transações
            </TabsTrigger>
            <TabsTrigger value="expenses" className="glass-button">
              Despesas Fixas
            </TabsTrigger>
            <TabsTrigger value="debts" className="glass-button">
              Dívidas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Balance */}
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Balanço Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {balance.toFixed(2).replace(".", ",")}</div>
                  <p className="text-xs text-muted-foreground">Balanço geral de todas as transações</p>
                </CardContent>
              </Card>

              {/* Income */}
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">+ R$ {income.toFixed(2).replace(".", ",")}</div>
                  <p className="text-xs text-muted-foreground">Total de entradas este mês</p>
                </CardContent>
              </Card>

              {/* Expenses */}
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">- R$ {expenses.toFixed(2).replace(".", ",")}</div>
                  <p className="text-xs text-muted-foreground">Total de saídas este mês</p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fixed Expenses */}
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Despesas Fixas</CardTitle>
                  <Calendar className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-400">
                    R$ {totalFixedExpenses.toFixed(2).replace(".", ",")}
                  </div>
                  <p className="text-xs text-muted-foreground">{fixedExpenses.length} despesa(s) ativa(s)</p>
                </CardContent>
              </Card>

              {/* Total Debts */}
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dívidas Totais</CardTitle>
                  <CreditCard className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">R$ {totalDebts.toFixed(2).replace(".", ",")}</div>
                  <p className="text-xs text-muted-foreground">{debts.length} dívida(s) ativa(s)</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions
                      .slice(-5)
                      .reverse()
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-blue-400/20"
                        >
                          <div>
                            <h3 className="font-medium">{transaction.description}</h3>
                            <p className="text-sm text-gray-400">{transaction.category}</p>
                          </div>
                                                  <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p
                              className={`font-medium ${
                                transaction.type === "income" ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"} R$ {formatAmount(transaction.amount)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-gray-400">
                                {new Date(transaction.date).toLocaleDateString("pt-BR")}
                              </p>
                              {transaction.receipt && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 text-blue-400 hover:text-blue-300"
                                  onClick={() => {
                                    // Em produção, você abriria o comprovante em um modal ou nova aba
                                    alert(`Comprovante: ${transaction.receipt}`)
                                  }}
                                  title="Ver comprovante"
                                >
                                  <FileText className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm("Tem certeza que deseja apagar esta transação?")) {
                                deleteTransaction(transaction.id)
                              }
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Nenhuma transação registrada ainda.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            {/* Seção de Transações Atribuídas (apenas para DJs) */}
            {!isAdmin && filteredTransactions.some(t => t.assignedTo) && (
              <Card className="glass-card border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Receitas Atribuídas pelo Admin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredTransactions
                      .filter(transaction => transaction.assignedTo)
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-400/30"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{transaction.description}</h3>
                              <Badge variant="outline" className="text-xs bg-blue-600/20 text-blue-400 border-blue-400/30">
                                <Users className="w-3 h-3 mr-1" />
                                Atribuída pelo Admin
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs glass-button">
                                {transaction.category}
                              </Badge>
                              <span className="text-sm text-gray-400">
                                {new Date(transaction.date).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="font-medium text-green-400">
                                + R$ {formatAmount(transaction.amount)}
                              </p>
                              {transaction.receipt && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 text-blue-400 hover:text-blue-300"
                                  onClick={() => {
                                    alert(`Comprovante de receita atribuída: ${transaction.receipt}`)
                                  }}
                                  title="Ver comprovante da receita atribuída"
                                >
                                  <FileText className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>{isAdmin ? "Todas as Transações" : "Minhas Transações"}</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTransactions.filter(t => !t.assignedTo).length > 0 ? (
                  <div className="space-y-3">
                    {filteredTransactions.filter(t => !t.assignedTo).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-blue-400/20"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{transaction.description}</h3>
                            {transaction.assignedTo && (
                              <Badge variant="outline" className="text-xs bg-blue-600/20 text-blue-400 border-blue-400/30">
                                <Users className="w-3 h-3 mr-1" />
                                Atribuída
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs glass-button">
                              {transaction.category}
                            </Badge>
                            <span className="text-sm text-gray-400">
                              {new Date(transaction.date).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p
                              className={`font-medium ${
                                transaction.type === "income" ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"} R$ {formatAmount(transaction.amount)}
                            </p>
                            {transaction.receipt && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 text-blue-400 hover:text-blue-300"
                                onClick={() => {
                                  // Em produção, você abriria o comprovante em um modal ou nova aba
                                  const message = transaction.assignedTo 
                                    ? `Comprovante de receita atribuída: ${transaction.receipt}`
                                    : `Comprovante: ${transaction.receipt}`
                                  alert(message)
                                }}
                                title={transaction.assignedTo ? "Ver comprovante da receita atribuída" : "Ver comprovante"}
                              >
                                <FileText className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm("Tem certeza que deseja apagar esta transação?")) {
                                deleteTransaction(transaction.id)
                              }
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    {isAdmin ? "Nenhuma transação registrada ainda." : "Nenhuma transação própria registrada ainda."}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Despesas Fixas</h2>
              <Button onClick={() => setShowFixedExpenseSheet(true)} className="orange-button" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova Despesa Fixa
              </Button>
            </div>

            <Card className="glass-card">
              <CardContent className="p-6">
                {fixedExpenses.length > 0 ? (
                  <div className="space-y-3">
                    {fixedExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-blue-400/20"
                      >
                        <div>
                          <h3 className="font-medium">{expense.description}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs glass-button">
                              {expense.category}
                            </Badge>
                            <span className="text-sm text-gray-400">Vence dia {expense.dueDay}</span>
                            <Badge
                              variant={expense.isActive ? "default" : "secondary"}
                              className={expense.isActive ? "bg-green-600" : ""}
                            >
                              {expense.isActive ? "Ativa" : "Inativa"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="font-medium text-red-400">R$ {formatAmount(expense.amount)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteFixedExpense(expense.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Nenhuma despesa fixa cadastrada ainda.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Dívidas</h2>
              <Button onClick={() => setShowDebtSheet(true)} className="orange-button" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova Dívida
              </Button>
            </div>

            <Card className="glass-card">
              <CardContent className="p-6">
                {debts.length > 0 ? (
                  <div className="space-y-3">
                    {debts.map((debt) => (
                      <div key={debt.id} className="p-4 bg-gray-800/50 rounded-lg border border-blue-400/20">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{debt.description}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteDebt(debt.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Credor</p>
                            <p className="font-medium">{debt.creditor}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Valor Total</p>
                            <p className="font-medium text-red-400">R$ {formatAmount(debt.totalAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Restante</p>
                            <p className="font-medium text-red-400">R$ {formatAmount(debt.remainingAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Parcela Mensal</p>
                            <p className="font-medium">R$ {formatAmount(debt.monthlyPayment)}</p>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">
                              Vencimento: {new Date(debt.dueDate).toLocaleDateString("pt-BR")}
                            </span>
                            {debt.interestRate && (
                              <span className="text-sm text-orange-400">Juros: {debt.interestRate}% a.m.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Nenhuma dívida cadastrada ainda.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />

      {showTransactionSheet && (
        <TransactionSheet
          isOpen={showTransactionSheet}
          onClose={() => setShowTransactionSheet(false)}
          type={transactionType}
        />
      )}

      {showFixedExpenseSheet && (
        <FixedExpenseSheet isOpen={showFixedExpenseSheet} onClose={() => setShowFixedExpenseSheet(false)} />
      )}

      {showDebtSheet && <DebtSheet isOpen={showDebtSheet} onClose={() => setShowDebtSheet(false)} />}
    </div>
  )
}
