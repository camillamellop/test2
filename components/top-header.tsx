"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, User, Share2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context-prisma"
import { ProfileSheet } from "./profile-sheet"

export function TopHeader() {
  const { user } = useAuth()
  const [showProfileSheet, setShowProfileSheet] = useState(false)

  return (
    <header className="glass-header sticky top-0 z-50 mobile-header mobile-safe-area">
      <div className="flex items-center justify-between p-4">
        {/* User Avatar */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowProfileSheet(true)}
            className="w-10 h-10 rounded-full p-0 touch-button"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </Button>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="touch-button"
          >
            <Bell className="w-5 h-5 mobile-icon" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="touch-button"
          >
            <User className="w-5 h-5 mobile-icon" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="touch-button"
          >
            <Share2 className="w-5 h-5 mobile-icon" />
          </Button>
        </div>
      </div>

      <ProfileSheet
        isOpen={showProfileSheet}
        onClose={() => setShowProfileSheet(false)}
      />
    </header>
  )
}
