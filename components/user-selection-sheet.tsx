"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Users, Check, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context-prisma"

interface User {
  id: number
  name?: string
  email: string
  role: "admin" | "dj"
}

interface UserSelectionSheetProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedUserIds: number[]) => void
  title?: string
  description?: string
  filterRole?: "admin" | "dj" | "all"
}

export function UserSelectionSheet({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Selecionar Usuários",
  description = "Escolha os usuários para compartilhar o evento",
  filterRole = "all"
}: UserSelectionSheetProps) {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadUsers()
    }
  }, [isOpen])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/users?excludeId=${user?.id}`)
      if (response.ok) {
        const usersData = await response.json()
        // Filtrar por role se especificado
        let filteredUsers = usersData
        if (filterRole !== "all") {
          filteredUsers = usersData.filter((u: User) => u.role === filterRole)
        }
        setUsers(filteredUsers)
      } else {
        console.error('Erro ao carregar usuários')
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserToggle = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleConfirm = () => {
    onConfirm(selectedUsers)
    setSelectedUsers([])
    setSearchTerm("")
    onClose()
  }

  const handleCancel = () => {
    setSelectedUsers([])
    setSearchTerm("")
    onClose()
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">{title}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div>
            <Label htmlFor="search">Buscar usuários</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o nome ou email..."
                className="pl-10 glass-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-orange-400">
                <Users className="w-5 h-5 inline mr-2" />
                Usuários Disponíveis
              </h3>
              <span className="text-sm text-gray-400">
                {selectedUsers.length} selecionado(s)
              </span>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto"></div>
                <p className="text-gray-400 mt-2">Carregando usuários...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      selectedUsers.includes(user.id)
                        ? 'bg-orange-500/20 border-orange-400'
                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserToggle(user.id)}
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <div>
                        <p className="font-medium text-white">
                          {user.name || 'Usuário sem nome'}
                        </p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    {selectedUsers.includes(user.id) && (
                      <Check className="w-5 h-5 text-orange-400" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum usuário encontrado</p>
                <p className="text-sm">Tente ajustar os termos de busca</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 glass-button"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedUsers.length === 0}
              className="flex-1 orange-button"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirmar ({selectedUsers.length})
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 