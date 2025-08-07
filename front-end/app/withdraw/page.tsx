"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Wallet, DollarSign, Trophy, MapPin } from 'lucide-react'
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "../../contexts/AppContext"
import { useWallet } from "../../contexts/wallet-context"
import { formatAddress } from "../../contexts/wallet-utils"

// Interface Club
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

export default function WithdrawPage() {
  const router = useRouter()
  const { userClubs, currentUser } = useApp()
  const { isConnected, publicKey, connect, isLoading, error } = useWallet()
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [withdrawAmount, setWithdrawAmount] = useState('')

  // Função para converter tokens em dólares (1 dólar = 1000 tokens)
  const tokensToUSD = (tokens: number) => {
    return (tokens / 1000).toFixed(2)
  }

  // Função para converter dólares em tokens
  const usdToTokens = (usd: number) => {
    return Math.floor(usd * 1000)
  }

  const handleConnect = async () => {
    try {
      await connect()
    } catch (err) {
      console.error('Failed to connect wallet:', err)
    }
  }

  const executeWithdraw = () => {
    if (!selectedClub || !withdrawAmount || !isConnected) return
    
    const withdrawTokens = parseFloat(withdrawAmount)
    const withdrawUSD = tokensToUSD(withdrawTokens)
    
    console.log(`Withdrawing ${withdrawTokens} tokens (${withdrawUSD} USD) from club ${selectedClub.name}`)
    // Here would be implemented the real withdraw logic
    
    // Redirect back after withdrawal
    router.push('/group')
  }

  const goBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F6F7F8]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[#333]">
        <button
          onClick={goBack}
          className="flex items-center space-x-2 text-[#FDDA24] hover:text-[#B7ACE8] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        <h1 className="text-xl font-bold">Sacar Tokens</h1>
        <div className="w-16"></div> {/* Spacer */}
      </div>

      <div className="p-6 max-w-md mx-auto">
        {/* Icon and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#FDDA24] rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-10 h-10 text-[#0F0F0F]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sacar Tokens</h2>
          <p className="text-[#D6D2C4] text-sm">
            Saque os tokens que você ganhou correndo.
          </p>
        </div>

        <div className="space-y-6">
          {/* Club Selection */}
          <div>
            <label className="text-[#F6F7F8] text-sm font-semibold mb-3 block">Selecionar Clube</label>
            <select
              value={selectedClub?.id || ''}
              onChange={(e) => {
                const club = userClubs.find(c => c.id === e.target.value)
                setSelectedClub(club || null)
              }}
              className="w-full h-14 bg-[#2A2A2A] border border-[#333] rounded-xl px-4 text-[#F6F7F8] focus:border-[#FDDA24] focus:outline-none"
            >
              <option value="">Escolha um clube</option>
              {userClubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name} - {club.balance.toLocaleString()} tokens disponíveis
                </option>
              ))}
            </select>
          </div>

          {/* Club Balance Display */}
          {selectedClub && (
            <div className="bg-[#2A2A2A] border border-[#333] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#FDDA24]" />
                  <span className="text-[#F6F7F8] font-semibold">{selectedClub.name}</span>
                </div>
                <span className="text-[#FDDA24] text-sm font-medium">{selectedClub.symbol}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-[#0F0F0F] rounded-lg">
                  <p className="text-[#666] text-xs mb-1">Tokens Disponíveis</p>
                  <p className="text-[#FDDA24] font-bold text-lg">{selectedClub.balance.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-[#0F0F0F] rounded-lg">
                  <p className="text-[#666] text-xs mb-1">Valor em USD</p>
                  <p className="text-[#FDDA24] font-bold text-lg">${tokensToUSD(selectedClub.balance)}</p>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-[#0F0F0F] rounded-lg">
                <p className="text-[#D6D2C4] text-xs text-center">
                  Ganho por km: ${selectedClub.dollarsPerKm} ({usdToTokens(selectedClub.dollarsPerKm)} tokens)
                </p>
              </div>
            </div>
          )}

          {/* Token Amount Input */}
          <div>
            <label className="text-[#F6F7F8] text-sm font-semibold mb-3 block">Quantidade de Tokens</label>
            <div className="relative">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                max={selectedClub?.balance || 0}
                placeholder="Digite a quantidade"
                className="w-full h-14 bg-[#2A2A2A] border border-[#333] rounded-xl px-4 pr-20 text-[#F6F7F8] focus:border-[#FDDA24] focus:outline-none"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#666] text-sm">
                tokens
              </div>
            </div>
            
            {withdrawAmount && selectedClub && (
              <div className="mt-2 p-3 bg-[#2A2A2A] rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-[#D6D2C4] text-sm">Valor em USD:</span>
                  <span className="text-[#FDDA24] font-bold">${tokensToUSD(parseFloat(withdrawAmount) || 0)}</span>
                </div>
              </div>
            )}
            
            {selectedClub && (
              <div className="flex justify-between items-center mt-2">
                <p className="text-[#666] text-sm">
                  Máximo: {selectedClub.balance.toLocaleString()} tokens
                </p>
                <button
                  onClick={() => setWithdrawAmount(selectedClub.balance.toString())}
                  className="text-[#FDDA24] text-sm hover:text-[#B7ACE8] transition-colors"
                >
                  Sacar tudo
                </button>
              </div>
            )}
          </div>

          {/* Wallet Status */}
          <div className="p-4 bg-[#2A2A2A] rounded-xl border border-[#333]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wallet className={`w-6 h-6 ${isConnected ? 'text-green-500' : 'text-[#666]'}`} />
                <div>
                  <p className="text-[#F6F7F8] font-semibold">
                    {isConnected ? 'Carteira Conectada' : 'Carteira Desconectada'}
                  </p>
                  <p className="text-[#666] text-xs">
                    {isConnected 
                      ? `Endereço: ${publicKey ? formatAddress(publicKey) : 'Desconhecido'}` 
                      : 'Conecte sua carteira para continuar'
                    }
                  </p>
                </div>
              </div>
              {!isConnected && (
                <Button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="bg-[#FDDA24] hover:bg-[#B7ACE8] text-[#0F0F0F] font-bold rounded-lg px-4 py-2"
                >
                  {isLoading ? 'Conectando...' : 'Conectar'}
                </Button>
              )}
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-2">{error}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={executeWithdraw}
              disabled={!selectedClub || !withdrawAmount || !isConnected || parseFloat(withdrawAmount) > (selectedClub?.balance || 0) || parseFloat(withdrawAmount) <= 0}
              className="w-full h-14 bg-[#FDDA24] hover:bg-[#B7ACE8] text-[#0F0F0F] font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {withdrawAmount && selectedClub ? 
                `Sacar ${parseFloat(withdrawAmount).toLocaleString()} tokens ($${tokensToUSD(parseFloat(withdrawAmount))})` : 
                'Sacar USD'
              }
            </Button>
            <Button
              onClick={goBack}
              variant="outline"
              className="w-full h-14 bg-transparent border-[#333] hover:bg-[#FDDA24] hover:bg-opacity-10 hover:border-[#FDDA24] text-[#F6F7F8] hover:text-[#FDDA24] font-semibold rounded-xl transition-all duration-200"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed bottom-4 right-4 opacity-10">
        <Image src="/images/yellow-brush.png" alt="" width={60} height={12} className="object-contain" />
      </div>
    </div>
  )
}