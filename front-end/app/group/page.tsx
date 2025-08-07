"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Menu, MessageCircle, Trophy, Settings, Send, Eye } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useApp } from "../../contexts/AppContext"
import { SignOutButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { MembersCard } from "../../components/group/MembersCard"
import { ClubTokensCard } from "../../components/group/ClubTokensCard"
import { AddFundsCard } from "../../components/group/AddFundsCard"
import GlobalDrawer from "../../components/GlobalDrawer"

export default function GroupPage() {
  const router = useRouter()
  const { userClubs, currentUser, getClubMessages, sendMessage, getClubRanking, selectedClub, setSelectedClub } = useApp()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'chat', 'ranking'
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    if (userClubs.length > 0 && !selectedClub) {
      setSelectedClub(userClubs[0])
    }
  }, [userClubs, selectedClub, setSelectedClub])

  // Se não tem grupos, mostra a tela vazia
  if (userClubs.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
            <Users className="w-12 h-12 text-[#FDDA24]" />
          </div>
          <h2 className="text-2xl font-bold text-[#F6F7F8] mb-4">Sem grupos disponíveis</h2>
          <p className="text-[#B7ACE8] mb-8 max-w-sm">
            Você ainda não faz parte de nenhum grupo. Crie seu primeiro clube ou junte-se a um existente!
          </p>
          <div className="space-y-4 w-full max-w-sm">
            <Button 
              onClick={() => router.push('/create-club')}
              className="w-full bg-[#FDDA24] text-[#0F0F0F] hover:bg-[#E5C321] font-semibold py-3"
            >
              Criar Novo Clube
            </Button>
            <Button 
              onClick={() => router.push('/join-group')}
              variant="outline"
              className="w-full bg-[#FDDA24] text-[#0F0F0F] hover:bg-[#E5C321] font-semibold py-3"
            >
              Juntar-se a um Grupo
            </Button>
            <SignOutButton>
              <Button 
                variant="outline"
                className="w-full border-red-400 text-red-400 hover:bg-red-400 hover:text-white font-semibold py-3"
              >
                Deslogar
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>
    )
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedClub) {
      sendMessage(selectedClub.id, newMessage.trim())
      setNewMessage('')
    }
  }

  const clubMessages = selectedClub ? getClubMessages(selectedClub.id) : []
  const clubRanking = selectedClub ? getClubRanking(selectedClub.id) : []

  const renderOverview = () => (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <MembersCard memberCount={selectedClub?.members.length || 0} />
        <ClubTokensCard 
          tokenName={selectedClub?.symbol || ''}
          totalTokens={selectedClub?.totalTokens || 0}
        />
        <AddFundsCard 
          onAddFunds={() => console.log('Add funds')}
          clubBalance={`$ ${selectedClub?.balance.toFixed(2) || '0.00'}`}
        />
      </div>
      
      <div className="bg-[#1A1A1A] rounded-xl p-4">
        <h3 className="text-[#F6F7F8] font-semibold mb-3">Informações do Clube</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[#B7ACE8]">Nome:</span>
            <span className="text-[#F6F7F8]">{selectedClub?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#B7ACE8]">Símbolo:</span>
            <span className="text-[#F6F7F8]">{selectedClub?.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#B7ACE8]">Total de Tokens:</span>
            <span className="text-[#F6F7F8]">{selectedClub?.totalTokens.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#B7ACE8]">Membros:</span>
            <span className="text-[#F6F7F8]">{selectedClub?.members.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#B7ACE8]">Saldo:</span>
            <span className="text-[#F6F7F8]">$ {selectedClub?.balance.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderChat = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          {clubMessages.length === 0 ? (
            <div className="text-center text-[#B7ACE8] py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma mensagem ainda</p>
              <p className="text-sm">Seja o primeiro a enviar uma mensagem!</p>
            </div>
          ) : (
            clubMessages.map((message) => (
              <div key={message.id} className="bg-[#1A1A1A] rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#FDDA24] font-semibold text-sm">{message.userName}</span>
                  <span className="text-[#666] text-xs">
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[#F6F7F8] text-sm">{message.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-[#2A2A2A]">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-[#2A2A2A] border-0 text-[#F6F7F8] placeholder:text-[#666]"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-[#FDDA24] text-[#0F0F0F] hover:bg-[#E5C321]"
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  const renderRanking = () => (
    <div className="p-4">
      <div className="space-y-3">
        {clubRanking.length === 0 ? (
          <div className="text-center text-[#B7ACE8] py-8">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum dado de ranking ainda</p>
            <p className="text-sm">Comece a correr para aparecer no ranking!</p>
          </div>
        ) : (
          clubRanking.map((user, index) => (
            <div key={user.id} className="bg-[#1A1A1A] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FDDA24] rounded-full flex items-center justify-center text-[#0F0F0F] font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="text-[#F6F7F8] font-semibold">{user.name}</p>
                  <p className="text-[#B7ACE8] text-sm">{user.totalKm} km totais</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#FDDA24] font-semibold">{user.totalTokens}</p>
                <p className="text-[#B7ACE8] text-xs">tokens</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white relative">
      {/* Global Drawer */}
      <GlobalDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        currentPage="group"
      />

      {/* Header */}
      <div className="bg-[#1A1A1A] p-4 flex items-center justify-between border-b border-[#2A2A2A]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDrawerOpen(true)}
          className="text-[#F6F7F8] hover:bg-[#2A2A2A]"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <h1 className="text-lg font-bold text-[#F6F7F8]">
          {selectedClub?.name || 'Meus Grupos'}
        </h1>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-[#F6F7F8] hover:bg-[#2A2A2A]"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'chat' && renderChat()}
        {activeTab === 'ranking' && renderRanking()}
      </div>

      {/* Bottom Navigation - Estilo da imagem */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#2A2A2A] px-4 py-2">
        <div className="flex justify-center items-center space-x-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center py-2 px-6 rounded-full transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-[#FDDA24] text-[#0F0F0F]'
                : 'text-[#B7ACE8] hover:text-[#F6F7F8]'
            }`}
          >
            <Eye className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Detalhes</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center justify-center py-2 px-6 rounded-full transition-all duration-200 ${
              activeTab === 'chat'
                ? 'bg-[#FDDA24] text-[#0F0F0F]'
                : 'text-[#B7ACE8] hover:text-[#F6F7F8]'
            }`}
          >
            <MessageCircle className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Bate-papo</span>
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`flex flex-col items-center justify-center py-2 px-6 rounded-full transition-all duration-200 ${
              activeTab === 'ranking'
                ? 'bg-[#FDDA24] text-[#0F0F0F]'
                : 'text-[#B7ACE8] hover:text-[#F6F7F8]'
            }`}
          >
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Ranking</span>
          </button>
        </div>
      </div>
    </div>
  )
}