"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from 'lucide-react'
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function JoinGroupPage() {
  const router = useRouter()
  const [inviteInput, setInviteInput] = useState("")

  const handleJoin = () => {
    if (inviteInput.trim()) {
      // Extract code from full URL or use as is
      const code = inviteInput.includes("code=") ? inviteInput.split("code=")[1] : inviteInput.trim()
      console.log("Joining group with code:", code)
      router.push('/group')
    }
  }

  const handleClose = () => {
    router.push('/getting-started')
  }

  const isValidInput = inviteInput.trim().length > 0

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-32 right-8 w-20 h-20 opacity-5">
        <Image src="/images/stellar-tower.png" alt="" width={80} height={80} className="object-contain" />
      </div>

      <div className="absolute bottom-40 left-6 w-16 h-16 opacity-5">
        <Image src="/images/stellar-community.png" alt="" width={64} height={64} className="object-contain" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-6 relative z-10">
        <button onClick={handleClose} className="text-[#F6F7F8] hover:text-[#FDDA24] transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 px-6">
        {/* Title and description */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#F6F7F8] mb-4">Juntar-se ao grupo</h1>
          <p className="text-[#D6D2C4] text-base">Insira um link de convite ou código para participar de um desafio.</p>
        </div>

        {/* Input field */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Invite link or code"
            value={inviteInput}
            onChange={(e) => setInviteInput(e.target.value)}
            className="w-full h-14 bg-[#2A2A2A] border-0 text-[#F6F7F8] placeholder:text-[#666] focus:bg-[#333] focus:ring-2 focus:ring-[#FDDA24] rounded-xl text-base"
          />
        </div>

        {/* Examples section */}
        <div className="mb-8">
          <h3 className="text-[#F6F7F8] font-medium mb-4">Parece que</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#FDDA24] rounded-full mr-3 flex-shrink-0"></div>
              <p className="text-[#D6D2C4] text-sm font-mono break-all">
                https://share.stellarrunclub.app/join?code=BKOQW
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#FDDA24] rounded-full mr-3 flex-shrink-0"></div>
              <p className="text-[#D6D2C4] text-sm font-mono">BKOQW</p>
            </div>
          </div>
        </div>

        {/* Join button */}
        <div className="mb-8">
          <Button
            onClick={handleJoin}
            disabled={!isValidInput}
            className="w-full h-14 bg-[#E53E3E] hover:bg-[#C53030] text-white font-bold text-lg rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Entrar no Grupo
          </Button>
        </div>

        {/* Discover section */}
        <div className="text-center">
          <p className="text-[#D6D2C4] text-sm">
            Procurando grupos para participar? Descubra desafios no{" "}
            <button className="text-[#FDDA24] hover:text-[#B7ACE8] font-semibold transition-colors">
              Stellar Explorer
            </button>
          </p>
        </div>

        {/* Yellow brush accent */}
        <div className="absolute bottom-32 right-8 opacity-20">
          <Image src="/images/yellow-brush.png" alt="" width={60} height={12} className="object-contain" />
        </div>
      </div>

      {/* Subtle decorative lines */}
      <div className="absolute top-1/4 left-4 w-px h-16 bg-[#FDDA24] opacity-20"></div>
      <div className="absolute bottom-1/3 right-6 w-px h-12 bg-[#B7ACE8] opacity-20"></div>
    </div>
  )
}
