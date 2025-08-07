"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Edit3, DollarSign, Clock, ToggleLeft, ToggleRight } from 'lucide-react'
import Image from "next/image"
import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "../../contexts/AppContext"

export default function CreateClubPage() {
  const router = useRouter()
  const { createClub: createClubInCache } = useApp()
  
  const [currentStep, setCurrentStep] = useState(1) // 1 = Create Club, 2 = Deposit
  const [isLoading, setIsLoading] = useState(false)
  
  // Club States
  const [clubName, setClubName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [description, setDescription] = useState("")
  const [bannerImage, setBannerImage] = useState<string | null>(null)
  
  // Deposit States
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
      setIsLoading(true)

      try {
        // Simulate club creation
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate delay
        
        // Create club in local cache
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
        
        // Redirect to dynamic route with club ID
        router.push(`/invite-challenge/${localClubId}`)
      } catch (err) {
        console.error('Unexpected error creating club:', err)
      } finally {
        setIsLoading(false)
      }
    }
  }, [currentStep, clubName, tokenSymbol, description, bannerImage, totalDeposit, isEquilibrated, expirationMonths, dollarsPerKm, createClubInCache, router])

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

  // Club Creation Component
  const ClubCreationStep = useMemo(() => (
    <>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#F6F7F8]">Create Club</h1>
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
              alt="Club banner"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center">
              {/* Stellar logo as placeholder */}
              <div className="w-16 h-16 mb-3 opacity-30">
                <Image src="/images/new-logo.avif" alt="Stellar" width={64} height={64} className="object-contain" />
              </div>
              <span className="text-[#666] text-sm">Banner photo</span>
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
            placeholder="Club name"
            value={clubName}
            onChange={handleClubNameChange}
            className="w-full h-14 bg-[#2A2A2A] border-0 text-[#F6F7F8] placeholder:text-[#666] focus:bg-[#333] focus:ring-2 focus:ring-[#FDDA24] rounded-xl text-base"
          />
        </div>

        {/* Token Symbol */}
        <div>
          <Input
            type="text"
            placeholder="Token symbol (e.g. SRC)"
            value={tokenSymbol}
            onChange={handleTokenSymbolChange}
            maxLength={6}
            className="w-full h-14 bg-[#2A2A2A] border-0 text-[#F6F7F8] placeholder:text-[#666] focus:bg-[#333] focus:ring-2 focus:ring-[#FDDA24] rounded-xl text-base"
          />
          <p className="text-[#666] text-xs mt-2">Maximum 6 characters for token symbol</p>
        </div>

        {/* Description */}
        <div>
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={handleDescriptionChange}
            className="w-full h-32 bg-[#2A2A2A] border-0 text-[#F6F7F8] placeholder:text-[#666] focus:bg-[#333] focus:ring-2 focus:ring-[#FDDA24] rounded-xl text-base resize-none"
          />
        </div>
      </div>
    </>
  ), [clubName, tokenSymbol, description, bannerImage, handleBannerUpload, handleClubNameChange, handleTokenSymbolChange, handleDescriptionChange])

  // Deposit Component
  const DepositStep = useMemo(() => (
    <>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#F6F7F8]">Deposit</h1>
        <p className="text-[#D6D2C4] text-sm mt-2">Configure your deposit parameters</p>
      </div>

      {/* Total to Deposit */}
      <div className="bg-[#2A2A2A] rounded-2xl p-6 mb-6 relative">
        {/* Stellar logo watermark */}
        <div className="absolute top-4 right-4 w-8 h-8 opacity-10">
          <Image src="/images/new-logo.avif" alt="Stellar" width={32} height={32} className="object-contain" />
        </div>

        <h3 className="text-[#F6F7F8] font-semibold text-lg mb-4">Total to Deposit</h3>
        
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

      {/* Equilibrium Toggle */}
      <div className="bg-[#2A2A2A] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#F6F7F8] font-semibold text-lg">Equilibrium</h3>
            <p className="text-[#D6D2C4] text-sm mt-1">Balanced reward distribution</p>
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

      {/* Expiration Time */}
      <div className="bg-[#2A2A2A] rounded-2xl p-6 mb-6">
        <h3 className="text-[#F6F7F8] font-semibold text-lg mb-4">Expiration Time</h3>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-[#B7ACE8] rounded-lg px-4 py-3 min-w-[100px]">
            <Clock className="w-5 h-5 text-[#0F0F0F] mr-2" />
            <span className="text-[#0F0F0F] font-bold">Months</span>
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

      {/* Dollars per KM Ratio */}
      <div className="bg-[#2A2A2A] rounded-2xl p-6 mb-6">
        <h3 className="text-[#F6F7F8] font-semibold text-lg mb-2">Ratio per KM</h3>
        <p className="text-[#D6D2C4] text-sm mb-4">How many dollars for each kilometer traveled</p>
        
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
        
        {/* Visual example */}
        <div className="mt-4 p-3 bg-[#1A1A1A] rounded-lg">
          <p className="text-[#FDDA24] text-sm font-medium">
            Example: {dollarsPerKm || "1"} DOL = 1 KM traveled
          </p>
        </div>
      </div>
    </>
  ), [totalDeposit, isEquilibrated, expirationMonths, dollarsPerKm, handleTotalDepositChange, toggleEquilibrated, handleExpirationMonthsChange, handleDollarsPerKmChange])

  // Simplified button without wallet integration
  const renderActionButton = () => {
    if (currentStep === 1) {
      return (
        <Button
          onClick={handleNextStep}
          disabled={!isClubFormValid}
          className="w-full h-14 bg-[#FDDA24] hover:bg-[#FDDA24] text-[#0F0F0F] font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-lg"
        >
          Next
        </Button>
      )
    }

    return (
      <Button
        onClick={handleNextStep}
        disabled={!isDepositFormValid || isLoading}
        className="w-full h-14 bg-[#FDDA24] hover:bg-[#FDDA24] text-[#0F0F0F] font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-lg"
      >
        {isLoading ? 'Creating club...' : 'CREATE CLUB'}
      </Button>
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

        {/* Next/Create Button - moved below fields */}
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
