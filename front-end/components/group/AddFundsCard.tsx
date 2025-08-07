import { Button } from "@/components/ui/button"
import { DollarSign, Plus } from 'lucide-react'

interface AddFundsCardProps {
  onAddFunds: () => void
  clubBalance: string
}

export const AddFundsCard = ({ onAddFunds, clubBalance }: AddFundsCardProps) => (
  <div className="bg-[#2A2A2A] rounded-xl p-4">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#00A7B5] rounded-full flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-[#F6F7F8]" />
        </div>
        <div>
          <p className="text-[#F6F7F8] font-semibold text-lg">Club Balance</p>
          <p className="text-[#FDDA24] font-bold text-2xl">{clubBalance}</p>
        </div>
      </div>
    </div>
    <p className="text-[#666] text-sm">Available funds for rewards and pools</p>
  </div>
)