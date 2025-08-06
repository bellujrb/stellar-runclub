"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Edit3, DollarSign, Clock, ToggleLeft, ToggleRight } from 'lucide-react'
import Image from "next/image"
import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "../../contexts/AppContext"
import { useWallet } from "../../contexts/wallet-context"
import { useCreateClub } from "../../hooks/use-create-club"

export default function CreateClubPage() {
  const router = useRouter()
  const { createClub: createClubInCache } = useApp()
  const { isConnected, connect, publicKey, error: walletError } = useWallet() // Adicionar walletError
  const { createClub, isLoading, error, clubId, transactionHash, resetResult } = useCreateClub()
  
  const [currentStep, setCurrentStep] = useState(1) // 1 = Criar Clube, 2 = Depósito
  
  // Estados do Clube
  const [clubName, setClubName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [description, setDescription] = useState("")
  const [bannerImage, setBannerImage] = useState<string | null>(null)
  
  // Estados do Depósito
  const [totalDeposit, setTotalDeposit] = useState("")
  const [isEquilibrated, setIsEquilibrated] = useState(false)
  const [expirationMonths, setExpirationMonths] = useState("")
  const [dollarsPerKm, setDollarsPerKm] = useState("1")

  const handleBannerUpload = useCallback(() => {
    // Placeholder for banner upload functionality
    console.log("Upload banner clicked")
  }, [])

  const handleNextStep = useCallback(async () => {
    if (currentStep === 1 && isClubFormValid) {
      setCurrentStep(2)
    } else if (currentStep === 2 && isDepositFormValid) {
      // Verificar se a carteira está conectada
      if (!isConnected) {
        await connect()
        return
      }

      // Verificar se há erros na carteira antes de prosseguir
      if (walletError) {
        console.error('Erro na carteira:', walletError)
        return // Bloquear se houver erro na carteira
      }

      // Resetar resultados anteriores
      resetResult()

      try {
        // Criar o clube no contrato Stellar
        const result = await createClub({
          name: clubName,
          tokenSymbol: tokenSymbol,
          description: description,
          bannerImage: bannerImage,
          totalDeposit: parseFloat(totalDeposit),
          isEquilibrated: isEquilibrated,
          expirationMonths: parseInt(expirationMonths),
          dollarsPerKm: parseFloat(dollarsPerKm)
        })

        // Só prosseguir se a criação foi bem-sucedida
        if (result?.success && result.clubId) {
          // Criar o clube no cache local também
          const localClubId = createClubInCache({
            name: clubName,
            tokenSymbol: tokenSymbol,
            description: description,
            bannerImage: bannerImage,
            totalDeposit: parseFloat(totalDeposit),
            isEquilibrated: isEquilibrated,
            expirationMonths: parseInt(expirationMonths),
            dollarsPerKm: parseFloat(dollarsPerKm)
          })
          
          // Redirecionar para a rota dinâmica com o ID do clube
          router.push(`/invite-challenge/${result.clubId}`)
        } else {
          // Se não foi bem-sucedida, não fazer nada (erro já está sendo mostrado)
          console.error('Falha ao criar clube:', result?.error || 'Erro desconhecido')
        }
      } catch (err) {
        console.error('Erro inesperado ao criar clube:', err)
      }
    }
  }, [currentStep, clubName, tokenSymbol, description, bannerImage, totalDeposit, isEquilibrated, expirationMonths, dollarsPerKm, createClub, createClubInCache, router, isConnected, connect, resetResult, walletError])

  const handleBack = useCallback(() => {
    if (currentStep === 2) {
      setCurrentStep(1)
    } else {
      router.push('/group')
    }
  }, [currentStep, router])

  const isClubFormValid = useMemo(() => 
    clubName.trim().length > 0 && tokenSymbol.trim().length > 0,
    [clubName, tokenSymbol]
  )
  
  const isDepositFormValid = useMemo(() => 
    totalDeposit && expirationMonths && dollarsPerKm,
    [totalDeposit, expirationMonths, dollarsPerKm]
  )

  // Handlers otimizados
  const handleClubNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setClubName(e.target.value)
  }, [])

  const handleTokenSymbolChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenSymbol(e.target.value.toUpperCase())
  }, [])

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }, [])

  const handleTotalDepositChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalDeposit(e.target.value)
  }, [])

  const handleExpirationMonthsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExpirationMonths(e.target.value)
  }, [])

  const handleDollarsPerKmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDollarsPerKm(e.target.value)
  }, [])

  const toggleEquilibrated = useCallback(() => {
    setIsEquilibrated(prev => !prev)
  }, [])

  // Componente de Criação do Clube
  const ClubCreationStep = useMemo(() => (
    <>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#F6F7F8]">Criar clube</h1>
        {/* Mostrar carteira conectada */}
        {isConnected && publicKey && (
          <p className="text-[#D6D2C4] text-sm mt-2">
            Carteira: {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
          </p>
        )}
      </div>

      {/* Banner photo section */}
      <div className="mb-6">
        <div
          className="w-full h-48 bg-[#2A2A2A] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#333] transition-colors relative overflow-hidden group"
          onClick={handleBannerUpload}
        >
          {bannerImage ? (
            <img
              src={bannerImage || "/placeholder.svg"}
              alt="Banner do clube"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center">
              {/* Stellar logo as placeholder */}
              <div className="w-16 h-16 mb-3 opacity-30">
                <Image src="/images/new-logo.avif" alt="Stellar" width={64} height={64} className="object-contain" />
              </div>
              <span className="text-[#666] text-sm">Foto do banner</span>
            </div>
          )}

          {/* Yellow brush accent */}
          <div className="absolute bottom-2 right-2 opacity-20">
            <Image src="/images/yellow-brush.png" alt="" width={40} height={8} className="object-contain" />
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        {/* Club name */}
        <div>
          <Input
            type="text"
            placeholder="Nome do clube"
            value={clubName}
            onChange={handleClubNameChange}
            className="w-full h-14 bg-[#2A2A2A] border-0 text-[#F6F7F8] placeholder:text-[#666] focus:bg-[#333] focus:ring-2 focus:ring-[#FDDA24] rounded-xl text-base"
          />
        </div>

        {/* Token Symbol */}
        <div>
          <Input
            type="text"
            placeholder="Sigla do token (ex: SRC)"
            value={tokenSymbol}
            onChange={handleTokenSymbolChange}
            maxLength={6}
            className="w-full h-14 bg-[#2A2A2A] border-0 text-[#F6F7F8] placeholder:text-[#666] focus:bg-[#333] focus:ring-2 focus:ring-[#FDDA24] rounded-xl text-base"
          />
          <p className="text-[#666] text-xs mt-2">Máximo 6 caracteres para a sigla do token</p>
        </div>

        {/* Description */}
        <div>
          <Textarea
            placeholder="Descrição (opcional)"
            value={description}
            onChange={handleDescriptionChange}
            className="w-full h-32 bg-[#2A2A2A] border-0 text-[#F6F7F8] placeholder:text-[#666] focus:bg-[#333] focus:ring-2 focus:ring-[#FDDA24] rounded-xl text-base resize-none"
          />
        </div>
      </div>
    </>
  ), [clubName, tokenSymbol, description, bannerImage, isConnected, publicKey, handleBannerUpload, handleClubNameChange, handleTokenSymbolChange, handleDescriptionChange])

  // Componente de Depósito
  const DepositStep = useMemo(() => (
    <>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#F6F7F8]">Depósito</h1>
        <p className="text-[#D6D2C4] text-sm mt-2">Configure os parâmetros do seu depósito</p>
        {/* Mostrar carteira conectada */}
        {isConnected && publicKey && (
          <p className="text-[#D6D2C4] text-xs mt-1">
            Organizador: {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
          </p>
        )}
      </div>

      {/* Total a Depositar */}
      <div className="bg-[#2A2A2A] rounded-2xl p-6 mb-6 relative">
        {/* Stellar logo watermark */}
        <div className="absolute top-4 right-4 w-8 h-8 opacity-10">
          <Image src="/images/new-logo.avif" alt="Stellar" width={32} height={32} className="object-contain" />
        </div>

        <h3 className="text-[#F6F7F8] font-semibold text-lg mb-4">Total a Depositar</h3>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-[#FDDA24] rounded-lg px-4 py-3 min-w-[80px]">
            <DollarSign className="w-5 h-5 text-[#0F0F0F] mr-1" />
            <span className="text-[#0F0F0F] font-bold">USD</span>
          </div>
          <Input
            type="number"
            placeholder="0.00"
            value={totalDeposit}
            onChange={handleTotalDepositChange}
            className="flex-1 bg-transparent border-0 text-[#F6F7F8] text-right text-2xl font-bold placeholder:text-[#666] focus:ring-0"
          />
        </div>
      </div>

      {/* Equilibrário Toggle */}
      <div className="bg-[#2A2A2A] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#F6F7F8] font-semibold text-lg">Equilibrário</h3>
            <p className="text-[#D6D2C4] text-sm mt-1">Distribuição equilibrada de recompensas</p>
          </div>
          <button
            onClick={toggleEquilibrated}
            className="transition-colors"
          >
            {isEquilibrated ? (
              <ToggleRight className="w-12 h-12 text-[#FDDA24]" />
            ) : (
              <ToggleLeft className="w-12 h-12 text-[#666]" />
            )}
          </button>
        </div>
      </div>

      {/* Tempo de Expiração */}
      <div className="bg-[#2A2A2A] rounded-2xl p-6 mb-6">
        <h3 className="text-[#F6F7F8] font-semibold text-lg mb-4">Tempo de Expiração</h3>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-[#B7ACE8] rounded-lg px-4 py-3 min-w-[100px]">
            <Clock className="w-5 h-5 text-[#0F0F0F] mr-2" />
            <span className="text-[#0F0F0F] font-bold">Meses</span>
          </div>
          <Input
            type="number"
            placeholder="6"
            value={expirationMonths}
            onChange={handleExpirationMonthsChange}
            className="flex-1 bg-transparent border-0 text-[#F6F7F8] text-right text-2xl font-bold placeholder:text-[#666] focus:ring-0"
          />
        </div>
      </div>

      {/* Proporção Dólares por KM */}
      <div className="bg-[#2A2A2A] rounded-2xl p-6 mb-6">
        <h3 className="text-[#F6F7F8] font-semibold text-lg mb-2">Proporção por KM</h3>
        <p className="text-[#D6D2C4] text-sm mb-4">Quantos dólares a cada quilômetro percorrido</p>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-[#00A7B5] rounded-lg px-4 py-3 min-w-[120px]">
            <DollarSign className="w-5 h-5 text-[#F6F7F8] mr-1" />
            <span className="text-[#F6F7F8] font-bold">/ KM</span>
          </div>
          <Input
            type="number"
            step="0.01"
            placeholder="1.00"
            value={dollarsPerKm}
            onChange={handleDollarsPerKmChange}
            className="flex-1 bg-transparent border-0 text-[#F6F7F8] text-right text-2xl font-bold placeholder:text-[#666] focus:ring-0"
          />
        </div>
        
        {/* Exemplo visual */}
        <div className="mt-4 p-3 bg-[#1A1A1A] rounded-lg">
          <p className="text-[#FDDA24] text-sm font-medium">
            Exemplo: {dollarsPerKm || "1"} DOL = 1 KM percorrido
          </p>
        </div>
      </div>
    </>
  ), [totalDeposit, isEquilibrated, expirationMonths, dollarsPerKm, isConnected, publicKey, handleTotalDepositChange, toggleEquilibrated, handleExpirationMonthsChange, handleDollarsPerKmChange])

  // Modificar o botão para mostrar estado de loading e erro
  const renderActionButton = () => {
    if (currentStep === 1) {
      return (
        <Button
          onClick={handleNextStep}
          disabled={!isClubFormValid}
          className="w-full h-14 bg-[#FDDA24] hover:bg-[#FDDA24] text-[#0F0F0F] font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-lg"
        >
          Próxima
        </Button>
      )
    }

    return (
      <div className="space-y-4">
        {/* Mostrar erro da carteira */}
        {walletError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm font-medium">Erro na carteira:</p>
            <p className="text-red-400 text-sm">{walletError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-red-300 text-xs underline mt-2 hover:text-red-200"
            >
              Recarregar página
            </button>
          </div>
        )}
        
        {/* Mostrar erro do hook */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm font-medium">Erro ao criar clube:</p>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {transactionHash && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-400 text-sm">
              Clube criado com sucesso! ID: {clubId}
            </p>
            <p className="text-green-400 text-xs mt-1">
              Hash: {transactionHash}
            </p>
          </div>
        )}

        <Button
          onClick={handleNextStep}
          disabled={!isDepositFormValid || isLoading || !isConnected || !!walletError || !!error}
          className="w-full h-14 bg-[#FDDA24] hover:bg-[#FDDA24] text-[#0F0F0F] font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-lg"
        >
          {isLoading ? 'Criando clube...' : 
           !isConnected ? 'Conectar carteira' : 
           walletError ? 'Erro na carteira' :
           error ? 'Erro - Tente novamente' :
           'CRIAR CLUBE'}
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-32 right-8 w-20 h-20 opacity-5">
        <Image src="/images/stellar-tower.png" alt="" width={80} height={80} className="object-contain" />
      </div>

      <div className="absolute bottom-40 left-6 w-16 h-16 opacity-5">
        <Image src="/images/stellar-community.png" alt="" width={64} height={64} className="object-contain" />
      </div>

      {/* Header - apenas com botão de voltar */}
      <div className="flex items-center justify-between p-6 relative z-10">
        <button onClick={handleBack} className="text-[#F6F7F8] hover:text-[#FDDA24] transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div></div> {/* Espaço vazio para manter o layout */}
      </div>

      {/* Main content */}
      <div className="flex-1 px-6">
        {currentStep === 1 ? ClubCreationStep : DepositStep}

        {/* Botão Próxima/Próximo - movido para baixo dos campos */}
        <div className="mt-8 mb-6">
          {renderActionButton()}
        </div>
      </div>

      {/* Subtle decorative lines */}
      <div className="absolute top-1/3 left-4 w-px h-16 bg-[#FDDA24] opacity-20"></div>
      <div className="absolute bottom-1/4 right-6 w-px h-12 bg-[#B7ACE8] opacity-20"></div>
    </div>
  )
}
