"use client"

import { Button } from "@/components/ui/button"
import { X, Copy, Share } from 'lucide-react'
import Image from "next/image"
import { useState, use } from "react"
import { useRouter } from "next/navigation"

interface InviteChallengePageProps {
  params: Promise<{
    id: string
  }>
}

export default function InviteChallengePage({ params }: InviteChallengePageProps) {
  const router = useRouter()
  const [memberEntry, setMemberEntry] = useState<"open" | "restricted">("open")
  const [copied, setCopied] = useState(false)
  
  // Usar React.use() para desembrulhar a Promise params
  const resolvedParams = use(params)
  const challengeId = resolvedParams.id
  const inviteLink = `https://share.stellarrunclub.app/join?code=${challengeId}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const handleNotNow = () => {
    router.push('/group')
  }

  const handleShare = () => {
    // Simulate sharing and then go to group screen
    console.log("Sharing invite link for challenge:", challengeId)
  }

  const handleClose = () => {
    router.push('/create-club')
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
          <h1 className="text-3xl font-bold text-[#F6F7F8] mb-4">Invite to Challenge</h1>
          <p className="text-[#D6D2C4] text-base">Invite members to the group by sharing the link below.</p>
          {/* Show challenge ID */}
          <p className="text-[#FDDA24] text-sm mt-2">Challenge ID: {challengeId}</p>
        </div>

        {/* Invite link section */}
        <div className="mb-8">
          <div className="bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-between">
            <div className="flex-1 mr-3">
              <p className="text-[#F6F7F8] text-sm font-mono break-all">{inviteLink}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="bg-[#FDDA24] hover:bg-[#B7ACE8] text-[#0F0F0F] px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? "COPIADO" : "COPIAR"}</span>
            </button>
          </div>
        </div>

        {/* Member entry options */}
        <div className="mb-8">
          <h3 className="text-[#F6F7F8] font-semibold text-lg mb-6">Member Entry</h3>

          <div className="space-y-4">
            {/* Open option */}
            <div className="flex items-start space-x-4 cursor-pointer" onClick={() => setMemberEntry("open")}>
              <div className="mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    memberEntry === "open" ? "border-[#FDDA24] bg-[#FDDA24]" : "border-[#666]"
                  }`}
                >
                  {memberEntry === "open" && <div className="w-2 h-2 bg-[#0F0F0F] rounded-full"></div>}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-[#F6F7F8] font-semibold mb-1">Open</h4>
                <p className="text-[#D6D2C4] text-sm">Anyone with the link can join.</p>
              </div>
            </div>

            {/* Restricted option */}
            <div className="flex items-start space-x-4 cursor-pointer" onClick={() => setMemberEntry("restricted")}>
              <div className="mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    memberEntry === "restricted" ? "border-[#FDDA24] bg-[#FDDA24]" : "border-[#666]"
                  }`}
                >
                  {memberEntry === "restricted" && <div className="w-2 h-2 bg-[#0F0F0F] rounded-full"></div>}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-[#F6F7F8] font-semibold mb-1">Restricted</h4>
                <p className="text-[#D6D2C4] text-sm">You must approve each member.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success message */}
        <div className="mb-8 bg-[#2A2A2A] rounded-xl p-4 border-l-4 border-[#FDDA24]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#FDDA24] rounded-full flex items-center justify-center">
              <span className="text-[#0F0F0F] font-bold text-sm">✓</span>
            </div>
            <div>
              <h4 className="text-[#F6F7F8] font-semibold mb-1">Challenge Created Successfully!</h4>
              <p className="text-[#D6D2C4] text-sm">Your Stellar Run Club is ready to accept members.</p>
            </div>
          </div>
        </div>

        {/* Yellow brush accent */}
        <div className="absolute bottom-32 right-8 opacity-20">
          <Image src="/images/yellow-brush.png" alt="" width={60} height={12} className="object-contain" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-6 space-y-4">
        <Button
          onClick={handleShare}
          className="w-full h-14 bg-[#FDDA24] hover:bg-[#FDDA24] text-[#0F0F0F] font-bold text-lg rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <Share className="w-5 h-5" />
          <span>Share Link</span>
        </Button>

        <Button
          onClick={handleNotNow}
          variant="outline"
          className="w-full h-14 bg-[#2A2A2A] border-[#333] hover:bg-[#FDDA24] hover:bg-opacity-10 hover:border-[#FDDA24] text-[#F6F7F8] hover:text-[#FDDA24] font-semibold text-lg rounded-2xl transition-all duration-200"
        >
          Not Now
        </Button>
      </div>

      {/* Subtle decorative lines */}
      <div className="absolute top-1/4 left-4 w-px h-16 bg-[#FDDA24] opacity-20"></div>
      <div className="absolute bottom-1/3 right-6 w-px h-12 bg-[#B7ACE8] opacity-20"></div>
    </div>
  )
}