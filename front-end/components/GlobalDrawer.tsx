"use client"

import { Button } from "@/components/ui/button"
import { Menu, Play, Plus, Settings, HelpCircle, LogOut, UserPlus, Users, X, Wallet, DollarSign } from 'lucide-react'
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "../contexts/AppContext"
import { SignOutButton } from '@clerk/nextjs'

// Adicionar a interface Club
interface Club {
  id: string
  name: string
  symbol: string
  description: string
  banner?: string
  createdBy: string
  members: string[]
  totalTokens: number
  balance: number
  dollarsPerKm: number
  expirationMonths: number
  totalDeposit: number
  inviteLink: string
}

interface GlobalDrawerProps {
  isOpen: boolean
  onClose: () => void
  currentPage?: string
}

export default function GlobalDrawer({ isOpen, onClose, currentPage }: GlobalDrawerProps) {
  const router = useRouter()
  const { userClubs, currentUser, setSelectedClub } = useApp()

  const handleLogout = () => {
    console.log("User logged out")
    onClose()
    router.push('/')
  }

  const navigateTo = (path: string) => {
    onClose()
    router.push(path)
  }

  const navigateToGroup = (club: Club) => {
    setSelectedClub(club)
    onClose()
    router.push('/group')
  }

  return (
    <>
      {/* Drawer Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 h-screen w-80 max-w-[80vw] bg-[#0F0F0F] z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* User Profile */}
          <button
            className="flex items-center space-x-3 mb-8 w-full text-left hover:bg-[#2A2A2A] p-2 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 bg-[#FDDA24] rounded-full flex items-center justify-center">
              <span className="text-[#0F0F0F] font-bold">{currentUser?.avatar || 'JR'}</span>
            </div>
            <div>
              <p className="text-[#F6F7F8] font-semibold">{currentUser?.name || 'João Rubens'}</p>
              <p className="text-[#666] text-sm">{currentUser?.totalKm || 0} km totais</p>
            </div>
          </button>

          {/* Menu Items */}
          <div className="space-y-2">
            <div className="text-[#666] text-xs font-semibold uppercase tracking-wider mb-3">Grupos</div>
            {userClubs.map((club) => (
              <button 
                key={club.id}
                onClick={() => navigateToGroup(club)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2A2A2A] transition-colors"
              >
                <div className="w-8 h-8 bg-[#FDDA24] rounded-full flex items-center justify-center">
                  <span className="text-[#0F0F0F] font-bold text-xs">{club.symbol}</span>
                </div>
                <span className="text-[#F6F7F8]">{club.name}</span>
              </button>
            ))}

            <div className="text-[#666] text-xs font-semibold uppercase tracking-wider mb-3 mt-6">Ações</div>
            <button 
              onClick={() => navigateTo('/create-club')}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2A2A2A] transition-colors"
            >
              <Plus className="w-5 h-5 text-[#FDDA24]" />
              <span className="text-[#F6F7F8]">Criar grupo</span>
            </button>
            <button 
              onClick={() => navigateTo('/join-group')}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2A2A2A] transition-colors"
            >
              <UserPlus className="w-5 h-5 text-[#B7ACE8]" />
              <span className="text-[#F6F7F8]">Juntar-se ao grupo</span>
            </button>

            <div className="text-[#666] text-xs font-semibold uppercase tracking-wider mb-3 mt-6">Configurações</div>
            <button 
              onClick={() => navigateTo('/start-run')}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2A2A2A] transition-colors"
            >
              <Play className="w-5 h-5 text-[#FDDA24]" />
              <span className="text-[#F6F7F8]">Iniciar Corrida</span>
            </button>
            <button 
              onClick={() => navigateTo('/withdraw')}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2A2A2A] transition-colors"
            >
              <DollarSign className="w-5 h-5 text-[#FDDA24]" />
              <span className="text-[#F6F7F8]">Sacar</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2A2A2A] transition-colors text-[#FDDA24]"
            >
              <LogOut className="w-5 h-5" />
              <span>Deslogar</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}