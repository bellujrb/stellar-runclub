"use client"

import { SignInButton, useUser } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Share } from 'lucide-react'
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect } from 'react'

export default function OnboardingPage() {
  const router = useRouter()
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    if (isSignedIn) {
      // Redireciona diretamente para o grupo após login
      router.push('/group')
    }
  }, [isSignedIn, user, router])

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 opacity-10">
        <Image src="/images/stellar-tower.png" alt="" width={128} height={128} className="object-contain" />
      </div>
      
      <div className="absolute bottom-20 left-8 w-24 h-24 opacity-5">
        <Image src="/images/stellar-tower.png" alt="" width={96} height={96} className="object-contain" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo section */}
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
          
          <div className="flex justify-center">
            <SignInButton mode="modal" forceRedirectUrl="/group">
              <Button 
                className="w-full h-14 bg-[#FDDA24] hover:bg-[#FDDA24] text-[#0F0F0F] font-bold text-lg rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Entrar</span>
              </Button>
            </SignInButton>
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
    </div>
  )
}
