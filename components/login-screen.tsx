"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (error) {
      console.error("Erro no login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* iPod-style Login */}
        <Card className="bg-gray-800 border-gray-700 rounded-3xl overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            {/* Screen */}
            <div className="bg-black text-white p-8 text-center">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">BEM-VINDO A</h1>
                <h2 className="text-3xl font-bold mb-4">CONEXÃO</h2>
                <div className="text-6xl font-bold mb-4">
                  <span className="text-white">U</span>
                  <span className="text-white">N</span>
                  <span className="text-white">K</span>
                </div>
              </div>

              <div className="w-full h-1 bg-purple-600 rounded mb-6"></div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "ENTRAR"}
                </Button>
              </form>
            </div>

            {/* Controls */}
            <div className="bg-gray-700 p-6">
              <div className="text-center mb-4">
                <span className="text-white font-medium">MENU</span>
              </div>

              {/* Circular Control */}
              <div className="relative w-32 h-32 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
                  </div>
                </div>

                {/* Control Buttons */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white hover:bg-white/20"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white hover:bg-white/20"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <Play className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <Pause className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
