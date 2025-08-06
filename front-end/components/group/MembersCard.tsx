import { Users } from 'lucide-react'

interface MembersCardProps {
  memberCount: number
}

export const MembersCard = ({ memberCount }: MembersCardProps) => (
  <div className="bg-[#2A2A2A] rounded-xl p-4">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-[#FDDA24] rounded-full flex items-center justify-center">
        <Users className="w-5 h-5 text-[#0F0F0F]" />
      </div>
      <div>
        <p className="text-[#F6F7F8] font-bold text-xl">{memberCount}</p>
        <p className="text-[#666] text-sm">Integrantes</p>
      </div>
    </div>
  </div>
)