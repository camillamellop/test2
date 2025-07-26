"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RotateCcw, Edit, Save, X } from "lucide-react"
import { TopHeader } from "./top-header"
import { BottomNavigation } from "./bottom-navigation"

export function AboutMenu() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [contractRules, setContractRules] = useState(
    `
1. Valores de cachê são definidos conforme o tipo de evento e localização
2. Pagamento deve ser realizado até 48h após o evento
3. Cancelamentos com menos de 7 dias de antecedência: cobrança de 50% do cachê
4. Equipamentos de som e luz são de responsabilidade do contratante
5. Transporte e hospedagem (quando necessário) por conta do contratante
  `.trim(),
  )

  const [feePolicy, setFeePolicy] = useState(
    `
1. Horário de apresentação deve ser respeitado conforme acordado
2. Set list pode ser adaptada conforme o público e ambiente
3. Direitos autorais das músicas são de responsabilidade do contratante
4. Gravação do evento requer autorização prévia por escrito
5. Condições climáticas adversas podem resultar em cancelamento
  `.trim(),
  )

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    setIsEditing(false)
  }

  const handleSave = () => {
    setIsEditing(false)
    // Aqui você pode adicionar lógica para salvar no banco de dados
  }

  return (
    <div className="min-h-screen text-white relative">
      {/* Animated background particles */}
      <div className="bg-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <TopHeader />

      <div className="p-4 pb-20 flex items-center justify-center min-h-[calc(100vh-140px)]">
        <div className="w-full max-w-md">
          {/* 3D Card Container */}
          <div className="relative w-full h-[600px] perspective-1000">
            <div
              className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Front Side - Quem Somos */}
              <div className="absolute inset-0 w-full h-full backface-hidden">
                <Card className="glass-card h-full flex flex-col">
                  {/* Logo Circle */}
                  <div className="flex justify-center pt-8 pb-4">
                    <div className="w-20 h-20 rounded-full bg-black border-2 border-green-400 flex items-center justify-center">
                      <span className="text-green-400 font-bold text-lg">UNK</span>
                    </div>
                  </div>

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-3xl font-bold text-white mb-2">UNK</CardTitle>
                    <p className="text-gray-400 text-lg">Assessoria</p>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-center px-8">
                    <div className="space-y-6">
                      <h3 className="text-green-400 text-xl font-bold text-center">Quem Somos</h3>

                      <div className="space-y-4 text-center">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          A Conexão UNK é um núcleo de desenvolvimento artístico real, criado por quem vive a música de
                          verdade e conhece o peso que ela pode carregar.
                        </p>

                        <p className="text-gray-300 text-sm leading-relaxed">
                          Aqui, o artista não é só mais um perfil na vitrine. A gente olha pra a pessoa por trás do
                          projeto.
                        </p>

                        <div className="bg-gray-800/30 p-4 rounded-lg border border-green-400/20">
                          <p className="text-green-400 text-sm italic leading-relaxed">
                            "Essa é a raiz da Conexão UNK. Se for pra construir algo, que seja com propósito."
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <div className="p-6">
                    <Button onClick={handleFlip} className="w-full glass-button flex items-center justify-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Ver Termos do Contrato
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Back Side - Termos do Contrato */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                <Card className="glass-card h-full flex flex-col">
                  <CardHeader className="text-center border-b border-blue-400/20">
                    <CardTitle className="text-2xl font-bold text-white">Termos do Contrato</CardTitle>
                    <div className="flex justify-center gap-2 mt-4">
                      <Button onClick={() => setIsEditing(!isEditing)} size="sm" className="glass-button">
                        {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                        {isEditing ? "Cancelar" : "Editar"}
                      </Button>
                      {isEditing && (
                        <Button onClick={handleSave} size="sm" className="orange-button">
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Regras Contratuais */}
                    <div>
                      <h3 className="text-green-400 text-lg font-bold mb-3">Regras Contratuais</h3>
                      <div className="glass-card p-4">
                        {isEditing ? (
                          <Textarea
                            value={contractRules}
                            onChange={(e) => setContractRules(e.target.value)}
                            className="glass-input min-h-[120px] resize-none text-sm"
                            placeholder="Inserir regras contratuais..."
                          />
                        ) : (
                          <div className="text-gray-300 text-sm space-y-2">
                            {contractRules.split("\n").map((rule, index) => (
                              <p key={index} className="leading-relaxed">
                                {rule}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cachê & Políticas */}
                    <div>
                      <h3 className="text-green-400 text-lg font-bold mb-3">Cachê & Políticas</h3>
                      <div className="glass-card p-4">
                        {isEditing ? (
                          <Textarea
                            value={feePolicy}
                            onChange={(e) => setFeePolicy(e.target.value)}
                            className="glass-input min-h-[120px] resize-none text-sm"
                            placeholder="Inserir políticas de cachê e termos..."
                          />
                        ) : (
                          <div className="text-gray-300 text-sm space-y-2">
                            {feePolicy.split("\n").map((policy, index) => (
                              <p key={index} className="leading-relaxed">
                                {policy}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <div className="p-4 border-t border-blue-400/20">
                    <Button onClick={handleFlip} className="w-full glass-button flex items-center justify-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Voltar para Quem Somos
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
