"use client"

import { Button } from "@/components/ui/button"
import { Menu, Play, Pause, Square, MapPin, Timer, Activity, Trophy, Coins } from 'lucide-react'
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "../../contexts/AppContext"
import GlobalDrawer from "../../components/GlobalDrawer"

export default function StartRunPage() {
  const router = useRouter()
  const { userClubs, currentUser, updateUserStats, getClubById } = useApp()
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [distance, setDistance] = useState(0)
  const [duration, setDuration] = useState(0)
  const [pace, setPace] = useState("0:00")
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [tokensEarned, setTokensEarned] = useState(0)
  const [showDrawer, setShowDrawer] = useState(false)

  const selectedClub = selectedClubId ? getClubById(selectedClubId) : null

  // Simula o contador de distância durante a corrida
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setDistance(prev => {
          const increment = Math.random() * 0.02 + 0.01 // 0.01-0.03 km por segundo
          return prev + increment
        })
        setDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, isPaused])

  // Calcula o pace (tempo por km)
  useEffect(() => {
    if (distance > 0 && duration > 0) {
      const paceInSeconds = duration / distance
      const minutes = Math.floor(paceInSeconds / 60)
      const seconds = Math.floor(paceInSeconds % 60)
      setPace(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }
  }, [distance, duration])

  const handleStartRun = () => {
    if (!selectedClub) return
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePauseRun = () => {
    setIsPaused(!isPaused)
  }

  const handleStopRun = () => {
    if (!selectedClub) return
    
    // Calcula tokens baseado no dollarsPerKm do clube
    const earnedTokens = Math.floor(distance * selectedClub.dollarsPerKm)
    setTokensEarned(earnedTokens)
    
    // Atualiza as estatísticas do usuário
    updateUserStats(distance, earnedTokens)
    
    setIsRunning(false)
    setIsPaused(false)
    setShowCompletionModal(true)
    
    console.log(`Corrida finalizada: ${distance.toFixed(2)}km em ${Math.floor(duration/60)}:${(duration%60).toString().padStart(2, '0')} - ${earnedTokens} tokens ganhos (${selectedClub.dollarsPerKm} tokens/km)`)
  }

  const handleCloseModal = () => {
    setShowCompletionModal(false)
    // Reset da corrida
    setDistance(0)
    setDuration(0)
    setPace("0:00")
    setTokensEarned(0)
    setSelectedClubId(null)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex justify-center">
      {/* Mobile Container for Desktop */}
      <div className="w-full max-w-md bg-[#0F0F0F] relative flex flex-col min-h-screen">
        {/* Completion Modal */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-60 flex items-center justify-center p-6">
            <div className="bg-[#2A2A2A] rounded-2xl p-6 max-w-sm w-full relative">
              <div className="absolute top-4 right-4 w-8 h-8 opacity-10">
                <Image src="/images/new-logo.avif" alt="Stellar" width={32} height={32} className="object-contain" />
              </div>

              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[#FDDA24] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-[#0F0F0F]" />
                </div>
                <h3 className="text-[#F6F7F8] font-bold text-2xl mb-2">Parabéns!</h3>
                <p className="text-[#D6D2C4] text-sm mb-4">
                  Você concluiu {distance.toFixed(2)} km em {formatTime(duration)}
                </p>
                
                {/* Stats */}
                <div className="bg-[#1A1A1A] rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-[#FDDA24] text-2xl font-bold">{distance.toFixed(2)}</div>
                      <div className="text-[#666] text-xs">Quilômetros</div>
                    </div>
                    <div>
                      <div className="text-[#B7ACE8] text-2xl font-bold">{pace}</div>
                      <div className="text-[#666] text-xs">Pace médio</div>
                    </div>
                  </div>
                </div>

                {/* Tokens Earned */}
                <div className="bg-gradient-to-r from-[#FDDA24] to-[#B7ACE8] rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <Coins className="w-6 h-6 text-[#0F0F0F]" />
                    <span className="text-[#0F0F0F] font-bold text-lg">+{tokensEarned} Tokens</span>
                  </div>
                  <p className="text-[#0F0F0F] text-sm mt-1 opacity-80">
                    Adicionados ao seu clube!
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleCloseModal}
                  className="w-full h-12 bg-[#FDDA24] hover:bg-[#B7ACE8] text-[#0F0F0F] font-bold rounded-xl transition-all duration-200"
                >
                  Continuar
                </Button>
              </div>

              <div className="absolute bottom-2 right-2 opacity-20">
                <Image src="/images/yellow-brush.png" alt="" width={40} height={8} className="object-contain" />
              </div>
            </div>
          </div>
        )}

        {/* Global Drawer */}
        <GlobalDrawer 
          isOpen={showDrawer} 
          onClose={() => setShowDrawer(false)} 
          currentPage="start-run"
        />

        {/* Background decorative elements */}
        <div className="absolute top-20 right-8 w-20 h-20 opacity-5">
          <Image src="/images/stellar-tower.png" alt="" width={80} height={80} className="object-contain" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#1A1A1A] border-b border-[#333]">
          <button onClick={() => setShowDrawer(true)} className="text-[#F6F7F8] hover:text-[#FDDA24] transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-[#F6F7F8] font-bold text-lg">Iniciar Corrida</h1>
          <div className="w-6 h-6"></div> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-6">
          {!isRunning ? (
            <>
              {/* Club Selection */}
              <div className="mb-8 mt-6">
                <h2 className="text-[#F6F7F8] font-semibold text-xl mb-4">Escolha seu Clube</h2>
                <div className="space-y-3">
                  {userClubs.map((club) => (
                    <button
                      key={club.id}
                      onClick={() => setSelectedClubId(club.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedClubId === club.id
                          ? 'border-[#FDDA24] bg-[#FDDA24] bg-opacity-10'
                          : 'border-[#333] bg-[#2A2A2A] hover:border-[#FDDA24] hover:bg-[#FDDA24] hover:bg-opacity-5'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#FDDA24] rounded-full flex items-center justify-center">
                          <span className="text-[#0F0F0F] font-bold text-lg">
                            {club.symbol}
                          </span>
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-[#F6F7F8] font-semibold text-lg">{club.name}</h3>
                          <p className="text-[#666] text-sm">{club.members.length} membros • {club.dollarsPerKm} tokens/km</p>
                        </div>
                        {selectedClubId === club.id && (
                          <div className="w-6 h-6 bg-[#FDDA24] rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#0F0F0F] rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                {userClubs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[#666] mb-4">Você não faz parte de nenhum clube ainda.</p>
                    <Button
                      onClick={() => router.push('/group')}
                      className="bg-[#FDDA24] text-[#0F0F0F] hover:bg-[#E5C321]"
                    >
                      Ir para Grupos
                    </Button>
                  </div>
                )}
              </div>

              {/* Start Button */}
              <div className="text-center">
                <Button
                  onClick={handleStartRun}
                  disabled={!selectedClubId || userClubs.length === 0}
                  className={`w-full h-16 text-xl font-bold rounded-2xl transition-all duration-200 ${
                    selectedClubId && userClubs.length > 0
                      ? 'bg-[#FDDA24] hover:bg-[#B7ACE8] text-[#0F0F0F]'
                      : 'bg-[#333] text-[#666] cursor-not-allowed'
                  }`}
                >
                  <Play className="w-8 h-8 mr-3" />
                  Iniciar Corrida
                </Button>
                {!selectedClubId && userClubs.length > 0 && (
                  <p className="text-[#666] text-sm mt-2">Selecione um clube para começar</p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Running Stats */}
              <div className="text-center mb-8 mt-6">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FDDA24] via-[#B7ACE8] to-[#00A7B5] rounded-full opacity-20 animate-pulse"></div>
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <Activity className="w-16 h-16 text-[#FDDA24]" />
                  </div>
                </div>
                <h2 className="text-[#F6F7F8] font-bold text-2xl mb-2">
                  {selectedClub?.name}
                </h2>
                <p className="text-[#666] text-sm">
                  {isPaused ? 'Corrida pausada' : 'Corrida em andamento'} • {selectedClub?.dollarsPerKm} tokens/km
                </p>
              </div>

              {/* Distance Display */}
              <div className="bg-[#2A2A2A] rounded-2xl p-8 mb-6 text-center">
                <div className="text-[#FDDA24] text-6xl font-bold mb-2">
                  {distance.toFixed(2)}
                </div>
                <div className="text-[#F6F7F8] text-xl font-semibold">Quilômetros</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#2A2A2A] rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Timer className="w-5 h-5 text-[#B7ACE8] mr-2" />
                    <span className="text-[#666] text-sm">Tempo</span>
                  </div>
                  <div className="text-[#F6F7F8] text-2xl font-bold">
                    {formatTime(duration)}
                  </div>
                </div>
                <div className="bg-[#2A2A2A] rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MapPin className="w-5 h-5 text-[#00A7B5] mr-2" />
                    <span className="text-[#666] text-sm">Pace</span>
                  </div>
                  <div className="text-[#F6F7F8] text-2xl font-bold">
                    {pace}/km
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={handlePauseRun}
                  className="flex-1 h-14 bg-[#B7ACE8] hover:bg-[#9A8CD9] text-[#0F0F0F] font-bold rounded-xl"
                >
                  {isPaused ? (
                    <><Play className="w-6 h-6 mr-2" />Retomar</>
                  ) : (
                    <><Pause className="w-6 h-6 mr-2" />Pausar</>
                  )}
                </Button>
                <Button
                  onClick={handleStopRun}
                  className="flex-1 h-14 bg-[#E53E3E] hover:bg-[#C53030] text-white font-bold rounded-xl"
                >
                  <Square className="w-6 h-6 mr-2" />
                  Finalizar
                </Button>
              </div>
            </>
          )}

          {/* Yellow brush accent */}
          <div className="absolute bottom-32 right-8 opacity-20">
            <Image src="/images/yellow-brush.png" alt="" width={60} height={12} className="object-contain" />
          </div>
        </div>

        {/* Subtle decorative lines */}
        <div className="absolute top-1/4 left-4 w-px h-16 bg-[#FDDA24] opacity-20"></div>
        <div className="absolute bottom-1/3 right-6 w-px h-12 bg-[#B7ACE8] opacity-20"></div>
      </div>
    </div>
  )
}
