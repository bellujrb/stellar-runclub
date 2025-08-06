"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Award } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface UserProfileProps {
  onBack?: () => void
  userName?: string
  userAvatar?: string
}

export default function UserProfile({
  onBack,
  userName = "João Rubens Belluzzo Neto",
  userAvatar = "JRB",
}: UserProfileProps) {
  const [selectedMonth, setSelectedMonth] = useState("agosto de 2025")

  // Mock data for user statistics
  const userStats = {
    totalKm: "247.8",
    totalRuns: "42",
    groups: "5",
    tokens: "2,478",
    avgPace: "5:32",
    longestRun: "21.1",
  }

  // Mock calendar data - days with activity
  const activeDays = [2, 5, 8, 12, 15, 18, 22, 25, 28]
  const currentMonth = new Date(2025, 7) // August 2025
  const daysInMonth = new Date(2025, 8, 0).getDate()
  const firstDayOfMonth = new Date(2025, 7, 1).getDay()

  const weekDays = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]

  const renderCalendar = () => {
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isActive = activeDays.includes(day)
      days.push(
        <div
          key={day}
          className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-full ${
            isActive ? "bg-[#FDDA24] text-[#0F0F0F]" : "text-[#F6F7F8] hover:bg-[#2A2A2A]"
          } transition-colors cursor-pointer`}
        >
          {day}
        </div>,
      )
    }

    return days
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-8 w-20 h-20 opacity-5">
        <Image src="/images/stellar-tower.png" alt="" width={80} height={80} className="object-contain" />
      </div>

      <div className="absolute bottom-40 left-6 w-16 h-16 opacity-5">
        <Image src="/images/stellar-community.png" alt="" width={64} height={64} className="object-contain" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-6 relative z-10">
        <button onClick={onBack} className="text-[#F6F7F8] hover:text-[#FDDA24] transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[#F6F7F8] font-bold text-lg">Perfil</h1>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        {/* User Avatar and Name */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#E53E3E] rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <span className="text-white font-bold text-2xl">{userAvatar}</span>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FDDA24] rounded-full border-4 border-[#0F0F0F]"></div>
          </div>
          <h2 className="text-[#F6F7F8] font-bold text-xl mb-2">{userName}</h2>
          <p className="text-[#B7ACE8] text-sm">Membro desde Janeiro 2024</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#2A2A2A] rounded-xl p-4 text-center">
            <div className="text-[#FDDA24] text-2xl font-bold mb-1">{userStats.totalKm}</div>
            <div className="text-[#D6D2C4] text-xs">KM Totais</div>
          </div>
          <div className="bg-[#2A2A2A] rounded-xl p-4 text-center">
            <div className="text-[#B7ACE8] text-2xl font-bold mb-1">{userStats.totalRuns}</div>
            <div className="text-[#D6D2C4] text-xs">Corridas</div>
          </div>
          <div className="bg-[#2A2A2A] rounded-xl p-4 text-center">
            <div className="text-[#00A7B5] text-2xl font-bold mb-1">{userStats.groups}</div>
            <div className="text-[#D6D2C4] text-xs">Grupos</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#2A2A2A] rounded-xl p-4 text-center">
            <div className="text-[#FDDA24] text-lg font-bold mb-1">{userStats.tokens}</div>
            <div className="text-[#D6D2C4] text-xs">Tokens</div>
          </div>
          <div className="bg-[#2A2A2A] rounded-xl p-4 text-center">
            <div className="text-[#B7ACE8] text-lg font-bold mb-1">{userStats.avgPace}</div>
            <div className="text-[#D6D2C4] text-xs">Pace Médio</div>
          </div>
          <div className="bg-[#2A2A2A] rounded-xl p-4 text-center">
            <div className="text-[#00A7B5] text-lg font-bold mb-1">{userStats.longestRun}</div>
            <div className="text-[#D6D2C4] text-xs">Maior KM</div>
          </div>
        </div>

        {/* Activity Calendar */}
        <div className="bg-[#2A2A2A] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#F6F7F8] font-semibold text-lg">Atividade</h3>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#FDDA24]" />
              <span className="text-[#FDDA24] text-sm font-medium">{selectedMonth}</span>
            </div>
          </div>

          {/* Week days header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-[#666] text-xs font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">{renderCalendar()}</div>

          {/* Activity summary */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#FDDA24] rounded-full"></div>
              <span className="text-[#D6D2C4]">Dias ativos: {activeDays.length}</span>
            </div>
            <div className="text-[#666]">Meta: 20 dias</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-[#2A2A2A] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#F6F7F8] font-semibold text-lg">Conquistas</h3>
            <Award className="w-5 h-5 text-[#FDDA24]" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-[#FDDA24] rounded-lg p-3 text-center">
              <div className="text-[#0F0F0F] text-lg mb-1">🏃‍♂️</div>
              <div className="text-[#0F0F0F] text-xs font-medium">Primeiro KM</div>
            </div>
            <div className="bg-[#B7ACE8] rounded-lg p-3 text-center">
              <div className="text-[#0F0F0F] text-lg mb-1">🎯</div>
              <div className="text-[#0F0F0F] text-xs font-medium">Meta Semanal</div>
            </div>
            <div className="bg-[#00A7B5] rounded-lg p-3 text-center">
              <div className="text-[#F6F7F8] text-lg mb-1">👥</div>
              <div className="text-[#F6F7F8] text-xs font-medium">Social</div>
            </div>
            <div className="bg-[#666] rounded-lg p-3 text-center opacity-50">
              <div className="text-[#F6F7F8] text-lg mb-1">🏆</div>
              <div className="text-[#F6F7F8] text-xs font-medium">Maratona</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full h-12 bg-[#2A2A2A] hover:bg-[#333] text-[#F6F7F8] font-semibold rounded-xl border border-[#333] transition-colors">
          Ver todos os check-ins
        </Button>

        {/* Yellow brush accent */}
        <div className="absolute bottom-20 right-8 opacity-20">
          <Image src="/images/yellow-brush.png" alt="" width={60} height={12} className="object-contain" />
        </div>
      </div>

      {/* Subtle decorative lines */}
      <div className="absolute top-1/4 left-4 w-px h-16 bg-[#FDDA24] opacity-20"></div>
      <div className="absolute bottom-1/3 right-6 w-px h-12 bg-[#B7ACE8] opacity-20"></div>
    </div>
  )
}
