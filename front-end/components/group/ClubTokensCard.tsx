import { Coins } from 'lucide-react'

interface ClubTokensCardProps {
  tokens: string
}

export const ClubTokensCard = ({ tokens }: ClubTokensCardProps) => (
  <div className="bg-[#2A2A2A] rounded-xl p-4">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-[#B7ACE8] rounded-full flex items-center justify-center">
        <Coins className="w-5 h-5 text-[#0F0F0F]" />
      </div>
      <div>
        <p className="text-[#F6F7F8] font-bold text-xl">{tokens}</p>
        <p className="text-[#666] text-sm">Tokens</p>
      </div>
    </div>
  </div>
)