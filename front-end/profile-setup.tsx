"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, User } from "lucide-react"
import { useState } from "react"
import GettingStarted from "./getting-started"

interface ProfileSetupProps {
  onBack?: () => void
  onContinue?: () => void
}

export default function ProfileSetup({ onBack, onContinue }: ProfileSetupProps) {
  const [name, setName] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showGettingStarted, setShowGettingStarted] = useState(false)

  const handleImageUpload = () => {
    // Placeholder for image upload functionality
    console.log("Upload image clicked")
  }

  const handleContinue = () => {
    if (name.trim()) {
      setShowGettingStarted(true)
    }
  }

  if (showGettingStarted) {
    return <GettingStarted onBack={() => setShowGettingStarted(false)} />
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-[#F6F7F8] mb-4">Configure seu perfil</h1>
          <p className="text-[#D6D2C4] text-sm">Adicione uma foto e um nome para completar o seu perfil.</p>
        </div>

        {/* Profile Photo Section */}
        <div className="mb-8">
          <div className="relative">
            <div
              className="w-32 h-32 bg-[#2A2A2A] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#333] transition-colors"
              onClick={handleImageUpload}
            >
              {profileImage ? (
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <User className="w-8 h-8 text-[#666] mb-2" />
                  <span className="text-[#D6D2C4] text-xs text-center">Adicionar fotografia</span>
                </div>
              )}
            </div>

            {/* Camera icon */}
            <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-[#E53E3E] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#C53030] transition-colors">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Name Input */}
        <div className="w-full mb-6">
          <Input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-12 bg-transparent border-[#333] border-2 text-[#F6F7F8] placeholder:text-[#666] focus:border-[#FDDA24] focus:ring-0 rounded-lg"
          />
          <p className="text-[#666] text-xs mt-2">É assim que você será reconhecido em todo o aplicativo.</p>
        </div>

        {/* Continue Button */}
        <div className="w-full">
          <Button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="w-full h-12 bg-[#E53E3E] hover:bg-[#C53030] text-white font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  )
}
