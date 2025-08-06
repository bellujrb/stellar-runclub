"use client"

import { Button } from "@/components/ui/button"
import { Apple, Mail } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import ProfileSetup from "./profile-setup"

export default function Component() {
  const [currentScreen, setCurrentScreen] = useState<"onboarding" | "profile">("onboarding")

  const handleLoginClick = () => {
    setCurrentScreen("profile")
  }

  const handleBackToOnboarding = () => {
    setCurrentScreen("onboarding")
  }

  const handleProfileComplete = () => {
    // Navigate to next screen or complete onboarding
    console.log("Profile setup complete")
  }

  if (currentScreen === "profile") {
    return <ProfileSetup onBack={handleBackToOnboarding} onContinue={handleProfileComplete} />
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 opacity-10">
        <Image src="/images/stellar-tower.png" alt="" width={128} height={128} className="object-contain" />
      </div>

      <div className="absolute bottom-32 left-8 w-24 h-24 opacity-5">
        <Image src="/images/stellar-community.png" alt="" width={96} height={96} className="object-contain" />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
        {/* Logo area */}
        <div className="mb-12 relative">
          <div className="w-32 h-32 relative mb-6 mx-auto flex items-center justify-center">
            <Image
              src="/images/new-logo.avif"
              alt="Stellar Run Club"
              width={128}
              height={128}
              className="object-contain mx-auto"
            />
          </div>

          {/* Yellow brush stroke behind text */}
          <div className="relative">
            <div className="absolute -inset-2 opacity-80">
              <Image
                src="/images/yellow-brush.png"
                alt=""
                width={200}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#0F0F0F] relative z-10 text-center px-4">RUN CLUB</h1>
          </div>
        </div>

        {/* Welcome text */}
        <div className="text-center mb-12">
          <h2 className="text-2xl text-[#F6F7F8] mb-2">
            Bem-vindo ao <span className="font-bold">Stellar Run Club</span>
          </h2>
          <p className="text-[#D6D2C4] text-sm">Onde a corrida encontra a comunidade real</p>
        </div>

        {/* Continue with text */}
        <div className="w-full mb-8">
          <h3 className="text-[#F6F7F8] text-lg font-semibold mb-6">Continuar com...</h3>

          {/* Login buttons */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-12 bg-[#1C1C1C] border-[#333] text-[#F6F7F8] hover:bg-[#2A2A2A] hover:border-[#FDDA24] transition-colors"
              onClick={handleLoginClick}
            >
              <Apple className="w-5 h-5 mr-3" />
              Apple
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 bg-[#1C1C1C] border-[#333] text-[#F6F7F8] hover:bg-[#2A2A2A] hover:border-[#FDDA24] transition-colors"
              onClick={handleLoginClick}
            >
              <div className="w-5 h-5 mr-3 bg-white rounded-sm flex items-center justify-center">
                <span className="text-xs font-bold text-[#4285F4]">G</span>
              </div>
              Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 bg-[#1C1C1C] border-[#333] text-[#F6F7F8] hover:bg-[#2A2A2A] hover:border-[#FDDA24] transition-colors"
              onClick={handleLoginClick}
            >
              <Mail className="w-5 h-5 mr-3" />
              E-mail
            </Button>
          </div>
        </div>

        {/* Support text */}
        <div className="text-center">
          <p className="text-[#666] text-sm">
            Problemas para entrar?{" "}
            <button className="text-[#FDDA24] hover:text-[#B7ACE8] transition-colors">Contate o suporte</button>
          </p>
        </div>
      </div>

      {/* Subtle decorative lines */}
      <div className="absolute top-1/4 left-4 w-px h-16 bg-[#FDDA24] opacity-20"></div>
      <div className="absolute bottom-1/3 right-6 w-px h-12 bg-[#B7ACE8] opacity-20"></div>
    </div>
  )
}
