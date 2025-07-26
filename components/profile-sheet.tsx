"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context-prisma"
import { useToastNotification } from "@/contexts/toast-notification-context"
import { 
  User, 
  Camera, 
  Edit, 
  Save, 
  X, 
  Upload, 
  ExternalLink, 
  Instagram, 
  Twitter, 
  Youtube,
  Linkedin,
  Globe
} from "lucide-react"

interface ProfileSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileSheet({ isOpen, onClose }: ProfileSheetProps) {
  const { user, updateProfile } = useAuth()
  const { showSuccess, showError } = useToastNotification()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    portfolio: user?.portfolio || "",
    phone: user?.phone || "",
    location: user?.location || "",
    pixKey: user?.pixKey || "",
    socialMedia: {
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: "",
      website: ""
    }
  })

  // Estados para logo da empresa
  const [companyLogo, setCompanyLogo] = useState<string>("")
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null)
  const [logoUrl, setLogoUrl] = useState<string>("")
  const logoFileInputRef = useRef<HTMLInputElement>(null)

  // Carregar logo da empresa do localStorage
  useEffect(() => {
    const savedLogo = localStorage.getItem('companyLogo')
    if (savedLogo) {
      setCompanyLogo(savedLogo)
      setLogoUrl(savedLogo)
    }
  }, [])

  const handleChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Verificar se é uma imagem
      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
        // Criar URL temporária para preview
        const url = URL.createObjectURL(file)
        setAvatarUrl(url)
      } else {
        showError("Erro", "Por favor, selecione apenas imagens (JPG, PNG, GIF)")
      }
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setAvatarUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    try {
      if (user) {
        const updatedData = {
          ...formData,
          avatar: avatarUrl || user.avatar
        }
        
        await updateProfile(user.id, updatedData)
        setIsEditing(false)
        showSuccess("Sucesso", "Perfil atualizado com sucesso!")
      }
    } catch (error) {
      showError("Erro", "Erro ao atualizar perfil")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedFile(null)
    setAvatarUrl("")
    setFormData({
      name: user?.name || "",
      bio: user?.bio || "",
      portfolio: user?.portfolio || "",
      phone: user?.phone || "",
      location: user?.location || "",
      pixKey: user?.pixKey || "",
      socialMedia: {
        instagram: "",
        twitter: "",
        youtube: "",
        linkedin: "",
        website: ""
      }
    })
  }

  const handleLogoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedLogoFile(file)
        const url = URL.createObjectURL(file)
        setLogoUrl(url)
      } else {
        showError("Erro", "Por favor, selecione apenas imagens (JPG, PNG, GIF)")
      }
    }
  }

  const removeLogoFile = () => {
    setSelectedLogoFile(null)
    setLogoUrl("")
    if (logoFileInputRef.current) {
      logoFileInputRef.current.value = ""
    }
  }

  const handleLogoSave = async () => {
    if (selectedLogoFile) {
      // Simular upload - em produção, enviaria para servidor
      const url = URL.createObjectURL(selectedLogoFile)
      setCompanyLogo(url)
      localStorage.setItem('companyLogo', url)
      setSelectedLogoFile(null)
      showSuccess("Sucesso", "Logo da empresa salva com sucesso!")
    }
  }

  const handleLogoRemove = () => {
    setCompanyLogo("")
    setLogoUrl("")
    localStorage.removeItem('companyLogo')
    showSuccess("Sucesso", "Logo da empresa removida!")
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase() || "U"
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="bg-gray-800 border-gray-700 text-white w-96">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Perfil
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400/30">
                {avatarUrl || user?.avatar ? (
                  <img 
                    src={avatarUrl || user?.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(user?.name || "")}
                  </div>
                )}
              </div>
              
              {isEditing && (
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>

            {isEditing && (
              <div className="space-y-2 w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">{selectedFile.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                      className="h-6 w-6 text-red-400 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full glass-button"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Alterar foto
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Logo da Empresa Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Logo da Empresa</h3>
            <div className="flex items-center space-x-4">
              {companyLogo ? (
                <div className="relative">
                  <img 
                    src={companyLogo} 
                    alt="Logo da empresa" 
                    className="w-16 h-16 object-contain border border-gray-600 rounded-lg"
                  />
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleLogoRemove}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
              )}
              
              {isEditing && (
                <div className="flex-1 space-y-2">
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileSelect}
                    className="hidden"
                  />
                  {selectedLogoFile ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">{selectedLogoFile.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={removeLogoFile}
                          className="h-6 w-6 text-red-400 hover:text-red-300"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleLogoSave}
                          className="glass-button"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="w-full glass-button"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Informações Pessoais */}
          {isEditing && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="glass-input"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className="glass-input"
                  placeholder="Conte um pouco sobre você..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="portfolio">Portfolio/Website</Label>
                <div className="relative">
                  <Input
                    id="portfolio"
                    value={formData.portfolio}
                    onChange={(e) => handleChange("portfolio", e.target.value)}
                    className="glass-input pr-10"
                    placeholder="https://seu-portfolio.com"
                  />
                  {formData.portfolio && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => window.open(formData.portfolio, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="glass-input"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="glass-input"
                  placeholder="São Paulo, SP"
                />
              </div>

              <div>
                <Label htmlFor="pixKey">Chave PIX</Label>
                <Input
                  id="pixKey"
                  value={formData.pixKey}
                  onChange={(e) => handleChange("pixKey", e.target.value)}
                  className="glass-input"
                  placeholder="seu-email@exemplo.com"
                />
              </div>

              {/* Redes Sociais */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-white">Redes Sociais</h4>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="instagram" className="flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => handleChange("socialMedia.instagram", e.target.value)}
                      className="glass-input"
                      placeholder="@seuinstagram"
                    />
                  </div>

                  <div>
                    <Label htmlFor="twitter" className="flex items-center gap-2">
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </Label>
                    <Input
                      id="twitter"
                      value={formData.socialMedia.twitter}
                      onChange={(e) => handleChange("socialMedia.twitter", e.target.value)}
                      className="glass-input"
                      placeholder="@seutwitter"
                    />
                  </div>

                  <div>
                    <Label htmlFor="youtube" className="flex items-center gap-2">
                      <Youtube className="w-4 h-4" />
                      YouTube
                    </Label>
                    <Input
                      id="youtube"
                      value={formData.socialMedia.youtube}
                      onChange={(e) => handleChange("socialMedia.youtube", e.target.value)}
                      className="glass-input"
                      placeholder="Canal do YouTube"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={(e) => handleChange("socialMedia.linkedin", e.target.value)}
                      className="glass-input"
                      placeholder="Perfil do LinkedIn"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={formData.socialMedia.website}
                      onChange={(e) => handleChange("socialMedia.website", e.target.value)}
                      className="glass-input"
                      placeholder="https://seu-site.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informações de Visualização (não editando) */}
          {!isEditing && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400">Nome</Label>
                <p className="text-white">{user?.name || "Não informado"}</p>
              </div>

              <div>
                <Label className="text-gray-400">Biografia</Label>
                <p className="text-white">{user?.bio || "Não informado"}</p>
              </div>

              <div>
                <Label className="text-gray-400">Portfolio</Label>
                {user?.portfolio ? (
                  <div className="flex items-center gap-2">
                    <a 
                      href={user.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {user.portfolio}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500">Não informado</p>
                )}
              </div>

              <div>
                <Label className="text-gray-400">Telefone</Label>
                <p className="text-white">{user?.phone || "Não informado"}</p>
              </div>

              <div>
                <Label className="text-gray-400">Localização</Label>
                <p className="text-white">{user?.location || "Não informado"}</p>
              </div>

              <div>
                <Label className="text-gray-400">Chave PIX</Label>
                <p className="text-white">{user?.pixKey || "Não informado"}</p>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-2 pt-4">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex-1 glass-button">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="flex-1 glass-button">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 