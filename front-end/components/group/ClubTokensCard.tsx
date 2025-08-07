import { Coins } from 'lucide-react'

interface ClubTokensCardProps {
  tokenName: string
  totalTokens: number
}

export const ClubTokensCard = ({ tokenName, totalTokens }: ClubTokensCardProps) => (
  <div className="bg-[#2A2A2A] rounded-xl p-4">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-[#B7ACE8] rounded-full flex items-center justify-center">
        <Coins className="w-5 h-5 text-[#0F0F0F]" />
      </div>
      <div>
        <p className="text-[#F6F7F8] font-bold text-xl">{totalTokens.toLocaleString()}</p>
        <p className="text-[#666] text-sm">Tokens {tokenName}</p>
      </div>
    </div>
  </div>
)