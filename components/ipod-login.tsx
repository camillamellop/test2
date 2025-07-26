"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context-prisma"
import { useRouter } from "next/navigation"

export function IpodLogin() {
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  // Atualiza o relógio
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying)
    setShowLogin(true)
  }

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="relative">
        {/* iPod Body */}
        <div className="w-80 h-[600px] bg-gradient-to-b from-gray-100 to-gray-300 rounded-[40px] shadow-2xl border-4 border-gray-400 relative overflow-hidden bg-stone-500">
          {/* iPod Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-[36px] pointer-events-none"></div>

          {/* Screen */}
          <div className="mt-8 mx-6">
            <div className="w-full h-48 bg-black rounded-lg border-4 border-gray-600 relative overflow-hidden shadow-inner">
              {/* Screen Content */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
                {!showLogin ? (
                  // Welcome Screen
                  <div className="flex flex-col items-center justify-center h-full text-white p-4">
                    <div className="text-center mb-4">
                      <h1 className="text-lg font-bold mb-1 shadow-xl">BEM-VINDO À</h1>
                      <h2 className="text-xl font-bold mb-2 shadow-xl">CONEXÃO</h2>
                      <div className="text-4xl font-bold mb-4 tracking-wider">
                        <span className="text-white shadow-2xl">U</span>
                        <span className="text-stone-50">N</span>
                        <span className="text-white shadow-2xl">K</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-gray-700 rounded mb-4">
                      <div className="w-3/4 h-full bg-orange-400 rounded animate-pulse"></div>
                    </div>

                    <div className="text-xs text-gray-400 text-center">
                      <p>Pressione PLAY para continuar</p>
                      
                    </div>
                  </div>
                ) : (
                  // Login Screen
                  <div className="flex flex-col justify-center h-full text-white p-4">
                    <div className="text-center mb-4">
                      <h3 className="text-sm font-bold mb-2">LOGIN</h3>
                      <div className="text-xs text-gray-400 mb-4">Digite suas credenciais</div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-3">
                      <div>
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-gray-800 border-gray-600 text-white text-xs h-8"
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Senha"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-gray-800 border-gray-600 text-white text-xs h-8"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs h-8"
                      >
                        {isLoading ? "Entrando..." : "ENTRAR"}
                      </Button>
                    </form>
                  </div>
                )}
              </div>

              {/* Screen Reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* iPod Logo */}
          <div className="text-center mt-6 mb-4">
            <div className="text-gray-600 font-bold text-lg tracking-wider">unk</div>
          </div>

          {/* Control Wheel */}
          <div className="flex justify-center mt-8">
            <div className="relative w-40 h-40">
              {/* Outer Ring */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full shadow-lg border-2 border-gray-300">
                {/* Ring Shine */}
                <div className="absolute inset-1 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-full"></div>

                {/* Control Buttons */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-8 text-gray-700 hover:bg-white/20 rounded-full"
                  onClick={() => setShowLogin(false)}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 text-gray-700 hover:bg-white/20 rounded-full"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-8 h-8 text-gray-700 hover:bg-white/20 rounded-full"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-8 h-8 text-gray-700 hover:bg-white/20 rounded-full"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Center Button */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Button
                  onClick={handlePlayClick}
                  className={`w-16 h-16 rounded-full shadow-lg border-2 transition-all duration-200 ${
                    isPlaying
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 border-orange-500 shadow-orange-500/50"
                      : "bg-gradient-to-br from-gray-100 to-gray-300 border-gray-400 hover:from-gray-200 hover:to-gray-400"
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-gray-700 ml-1" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            
          </div>
        </div>

        {/* iPod Shadow */}
        <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 rounded-full blur-xl"></div>

        {/* Reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[40px] pointer-events-none"></div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
    </div>
  )
}
