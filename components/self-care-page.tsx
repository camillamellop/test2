"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smile, Moon, Activity, Heart, Plus, Sparkles } from "lucide-react"
import { TopHeader } from "./top-header"
import { BottomNavigation } from "./bottom-navigation"
import { SelfCareSheet } from "./self-care-sheet"
import { useSelfCare } from "@/contexts/self-care-context-prisma"

export function SelfCarePage() {
  const { metrics } = useSelfCare()
  const [showSheet, setShowSheet] = useState(false)
  const [selectedType, setSelectedType] = useState<"mood" | "sleep" | "activity" | "gratitude">("mood")

  const quickActions = [
    {
      icon: Smile,
      title: "Registrar Humor",
      description: "Como você se sente hoje?",
      color: "text-orange-400",
    },
    {
      icon: Moon,
      title: "Registrar Sono",
      description: "Quantas horas você dormiu?",
      color: "text-blue-400",
    },
    {
      icon: Activity,
      title: "Registrar Atividade",
      description: "Manteve seu corpo ativo?",
      color: "text-green-400",
    },
    {
      icon: Sparkles,
      title: "Registrar Gratidão",
      description: "Pelo que você é grato hoje?",
      color: "text-yellow-400",
    },
  ]

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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-6 h-6 text-orange-400" />
            <h1 className="text-2xl font-bold text-orange-400">AutoCuidado</h1>
          </div>
          <p className="text-gray-400">Cuide de você para cuidar da sua arte</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400 mb-1">{metrics.activeDays}</div>
              <div className="text-sm text-gray-400">Dias Ativos</div>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">{metrics.mood}</div>
              <div className="text-sm text-gray-400">Humor</div>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-400 mb-1">{metrics.sleep}</div>
              <div className="text-sm text-gray-400">Sono</div>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{metrics.gratitude}</div>
              <div className="text-sm text-gray-400">Gratidões</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              const actionType = action.title.includes("Humor") ? "mood" : 
                                action.title.includes("Sono") ? "sleep" : 
                                action.title.includes("Atividade") ? "activity" : "gratitude"
              
              return (
                <Card key={index} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full bg-gray-800 ${action.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-gray-400">{action.description}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedType(actionType)
                          setShowSheet(true)
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Wellness Tips */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-orange-400" />
              AutoCuidado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 text-blue-400">
              <svg viewBox="0 0 64 64" fill="currentColor">
                <path d="M32 8L36 20L48 16L44 28L56 32L44 36L48 48L36 44L32 56L28 44L16 48L20 36L8 32L20 28L16 16L28 20L32 8Z" />
              </svg>
            </div>
            <p className="text-gray-300 mb-4">
              Sua criatividade flui melhor quando você está bem. Reserve um momento para cuidar de si mesmo.
            </p>
          </CardContent>
        </Card>


      </div>

      <BottomNavigation />

      <SelfCareSheet 
        isOpen={showSheet} 
        onClose={() => setShowSheet(false)} 
        type={selectedType}
      />
    </div>
  )
}
