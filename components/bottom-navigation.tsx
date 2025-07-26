"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Calendar, 
  DollarSign, 
  Target, 
  Heart,
  Palette
} from "lucide-react"

export function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    {
      path: "/dashboard",
      icon: Home,
      label: "Início",
    },
    {
      path: "/dashboard/calendar",
      icon: Calendar,
      label: "Agenda",
    },
    {
      path: "/dashboard/finance",
      icon: DollarSign,
      label: "Finanças",
    },
    {
      path: "/dashboard/projects",
      icon: Target,
      label: "Projetos",
    },
    {
      path: "/dashboard/self-care",
      icon: Heart,
      label: "AutoCuidado",
    },
    {
      path: "/dashboard/branding",
      icon: Palette,
      label: "Branding",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-t border-gray-700 p-2 mobile-bottom-nav mobile-safe-area">
      <div className="flex justify-around items-center">
        {navigationItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon

          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => router.push(item.path)}
              className={`
                flex flex-col items-center justify-center gap-1 p-3 rounded-full
                min-w-[60px] min-h-[60px] transition-all duration-200 touch-button
                md:min-w-[60px] md:min-h-[60px]
                sm:min-w-[50px] sm:min-h-[50px]
                ${isActive 
                  ? "bg-blue-500/20 text-blue-300 border border-blue-400/30" 
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }
              `}
            >
              <Icon className="w-5 h-5 mobile-icon" />
              <span className="text-xs font-medium leading-tight text-center mobile-text-xs">
                {item.label}
              </span>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
