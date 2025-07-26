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
  
  // Estados para foto do perfil
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estados para logo da empresa
  const [companyLogo, setCompanyLogo] = useState<string>("")
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null)
  const [logoUrl, setLogoUrl] = useState<string>("")
  const logoFileInputRef = useRef<HTMLInputElement>(null)

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

  // Funções para foto do perfil
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
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

  // Funções para logo da empresa
  const handleLogoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        showError("Erro", "Por favor, selecione apenas arquivos de imagem")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        showError("Erro", "O arquivo deve ter no máximo 5MB")
        return
      }

      setSelectedLogoFile(file)
      const url = URL.createObjectURL(file)
      setLogoUrl(url)
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
    try {
      if (selectedLogoFile) {
        const fileName = `logo_${Date.now()}_${selectedLogoFile.name}`
        const fileUrl = `/uploads/${fileName}`
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setCompanyLogo(fileUrl)
        setLogoUrl(fileUrl)
        localStorage.setItem('companyLogo', fileUrl)
        
        showSuccess("Logo salva", "Logo da empresa foi salva com sucesso!")
        removeLogoFile()
      }
    } catch (error) {
      showError("Erro", "Erro ao salvar logo. Tente novamente.")
    }
  }

  const handleLogoRemove = () => {
    setCompanyLogo("")
    setLogoUrl("")
    localStorage.removeItem('companyLogo')
    showSuccess("Logo removida", "Logo da empresa foi removida")
  }

  const handleSave = async () => {
    try {
      let finalAvatarUrl = user?.avatar || ""
      if (selectedFile) {
        finalAvatarUrl = `avatar_${Date.now()}_${selectedFile.name}`
      }

      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        portfolio: formData.portfolio,
        phone: formData.phone,
        location: formData.location,
        pixKey: formData.pixKey,
        avatar: finalAvatarUrl,
        socialMedia: formData.socialMedia
      })

      showSuccess("Perfil atualizado", "Suas informações foram salvas com sucesso!")
      setIsEditing(false)
      removeFile()
    } catch (error) {
      showError("Erro", "Erro ao atualizar perfil. Tente novamente.")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
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
    removeFile()
  }

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
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
            </div>
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full glass-button"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          )}

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
                <Label htmlFor="portfolio">Link do Portfólio</Label>
                <Input
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={(e) => handleChange("portfolio", e.target.value)}
                  className="glass-input"
                  placeholder="https://seu-portfolio.com"
                />
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
                  placeholder="chave@email.com ou 12345678901"
                />
              </div>

              {/* Redes Sociais */}
              <div className="space-y-3">
                <Label>Redes Sociais</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="instagram" className="text-xs">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => handleChange("socialMedia.instagram", e.target.value)}
                      className="glass-input"
                      placeholder="@seu_instagram"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter" className="text-xs">Twitter</Label>
                    <Input
                      id="twitter"
                      value={formData.socialMedia.twitter}
                      onChange={(e) => handleChange("socialMedia.twitter", e.target.value)}
                      className="glass-input"
                      placeholder="@seu_twitter"
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube" className="text-xs">YouTube</Label>
                    <Input
                      id="youtube"
                      value={formData.socialMedia.youtube}
                      onChange={(e) => handleChange("socialMedia.youtube", e.target.value)}
                      className="glass-input"
                      placeholder="Canal do YouTube"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin" className="text-xs">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={(e) => handleChange("socialMedia.linkedin", e.target.value)}
                      className="glass-input"
                      placeholder="linkedin.com/in/seu-perfil"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Seção de Uploads */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Uploads
            </h3>

            {/* Upload de Foto do Perfil */}
            <div className="space-y-4 mb-6">
              <h4 className="text-md font-medium text-gray-300">Foto do Perfil</h4>
              
              <div className="space-y-2">
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
            </div>

            {/* Upload de Logo da Empresa */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-300">Logo da Empresa</h4>
              
              {/* Preview da logo atual */}
              {companyLogo && (
                <div className="text-center">
                  <Label className="text-sm text-gray-300 mb-2 block">Logo Atual</Label>
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <img
                      src={companyLogo}
                      alt="Logo da empresa"
                      className="max-h-16 mx-auto object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Upload de nova logo */}
              <div>
                <Label className="text-sm text-gray-300 mb-2 block">
                  Upload de Nova Logo
                </Label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileSelect}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => logoFileInputRef.current?.click()}
                    className="w-full glass-button"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Selecionar Imagem
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    PNG, JPG ou SVG (máx. 5MB)
                  </p>
                </div>
              </div>

              {/* Preview da nova logo */}
              {selectedLogoFile && (
                <div className="text-center">
                  <Label className="text-sm text-gray-300 mb-2 block">Preview</Label>
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <img
                      src={logoUrl}
                      alt="Preview da logo"
                      className="max-h-16 mx-auto object-contain"
                    />
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">{selectedLogoFile.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={removeLogoFile}
                        className="h-6 w-6 text-red-400 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Ações da logo */}
              <div className="flex gap-2">
                {companyLogo && (
                  <Button
                    variant="outline"
                    onClick={handleLogoRemove}
                    className="flex-1 glass-button"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remover
                  </Button>
                )}
                {selectedLogoFile && (
                  <Button
                    onClick={handleLogoSave}
                    className="flex-1 glass-button"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Logo
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 glass-button"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 glass-button"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 