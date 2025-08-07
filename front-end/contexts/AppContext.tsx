"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'

interface User {
  id: string
  name: string
  avatar: string
  totalKm: number
  totalTokens: number
  longestRun: number
  clubs: string[]
}

interface Club {
  id: string
  name: string
  symbol: string
  description: string
  banner?: string
  createdBy: string
  members: string[]
  totalTokens: number
  balance: number
  dollarsPerKm: number
  expirationMonths: number
  totalDeposit: number
  inviteLink: string
}

interface ChatMessage {
  id: string
  clubId: string
  userId: string
  userName: string
  message: string
  timestamp: Date
}

interface AppContextType {
  // User data
  currentUser: User | null
  updateUserStats: (km: number, tokens: number) => void
  
  // Clubs
  clubs: Club[]
  userClubs: Club[]
  createClub: (clubData: {
    name: string;
    tokenSymbol: string;
    description: string;
    bannerImage: string | null;
    totalDeposit: number;
    isEquilibrated: boolean;
    expirationMonths: number;
    dollarsPerKm: number;
  }) => string;
  joinClub: (inviteLink: string) => boolean
  getClubById: (id: string) => Club | null
  
  // Chat
  messages: ChatMessage[]
  sendMessage: (clubId: string, message: string) => void
  getClubMessages: (clubId: string) => ChatMessage[]
  
  // Ranking
  getClubRanking: (clubId: string) => User[]
  
  // Selected Club
  selectedClub: Club | null
  setSelectedClub: (club: Club) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser } = useUser()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [clubs, setClubs] = useState<Club[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)

  // Initialize data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedClubs = localStorage.getItem('stellar-clubs')
      const savedMessages = localStorage.getItem('stellar-messages')
      const savedUsers = localStorage.getItem('stellar-users')
      
      if (savedClubs) {
        setClubs(JSON.parse(savedClubs))
      }
      
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      }
      
      if (clerkUser && savedUsers) {
        const users = JSON.parse(savedUsers)
        const existingUser = users.find((u: User) => u.id === clerkUser.id)
        
        if (existingUser) {
          setCurrentUser(existingUser)
        } else {
          const newUser: User = {
            id: clerkUser.id,
            name: `${clerkUser.firstName} ${clerkUser.lastName}` || 'Usuário',
            avatar: `${clerkUser.firstName?.charAt(0) || 'U'}${clerkUser.lastName?.charAt(0) || ''}`,
            totalKm: 0,
            totalTokens: 0,
            longestRun: 0,
            clubs: []
          }
          
          const updatedUsers = [...users, newUser]
          localStorage.setItem('stellar-users', JSON.stringify(updatedUsers))
          setCurrentUser(newUser)
        }
      } else if (clerkUser) {
        const newUser: User = {
          id: clerkUser.id,
          name: `${clerkUser.firstName} ${clerkUser.lastName}` || 'Usuário',
          avatar: `${clerkUser.firstName?.charAt(0) || 'U'}${clerkUser.lastName?.charAt(0) || ''}`,
          totalKm: 0,
          totalTokens: 0,
          longestRun: 0,
          clubs: []
        }
        
        localStorage.setItem('stellar-users', JSON.stringify([newUser]))
        setCurrentUser(newUser)
      }
    }
  }, [clerkUser])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window !== 'undefined' && clubs.length > 0) {
      localStorage.setItem('stellar-clubs', JSON.stringify(clubs))
    }
  }, [clubs])

  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem('stellar-messages', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser) {
      const savedUsers = localStorage.getItem('stellar-users')
      const users = savedUsers ? JSON.parse(savedUsers) : []
      const updatedUsers = users.map((u: User) => 
        u.id === currentUser.id ? currentUser : u
      )
      localStorage.setItem('stellar-users', JSON.stringify(updatedUsers))
    }
  }, [currentUser])

  const updateUserStats = (km: number, tokens: number) => {
    if (!currentUser) return
    
    setCurrentUser(prev => {
      if (!prev) return null
      return {
        ...prev,
        totalKm: prev.totalKm + km,
        totalTokens: prev.totalTokens + tokens,
        longestRun: Math.max(prev.longestRun, km)
      }
    })
  }

  const createClub = (clubData: {
    name: string;
    tokenSymbol: string;
    description: string;
    bannerImage: string | null;
    totalDeposit: number;
    isEquilibrated: boolean;
    expirationMonths: number;
    dollarsPerKm: number;
  }) => {
    if (!currentUser) return ''
    
    const clubId = `club_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const inviteLink = `${window.location.origin}/join-group?invite=${clubId}`
    
    // Conversão: 1 USD = 1000 tokens do clube
    const totalTokensFromDeposit = clubData.totalDeposit * 1000
    
    const newClub: Club = {
      id: clubId,
      name: clubData.name,
      symbol: clubData.tokenSymbol,
      description: clubData.description,
      banner: clubData.bannerImage || undefined,
      createdBy: currentUser.id,
      members: [currentUser.id],
      totalTokens: totalTokensFromDeposit, // Agora baseado na conversão 1 USD = 1000 tokens
      balance: clubData.totalDeposit,
      dollarsPerKm: clubData.dollarsPerKm,
      expirationMonths: clubData.expirationMonths,
      totalDeposit: clubData.totalDeposit,
      inviteLink
    }
    
    setClubs(prev => [...prev, newClub])
    
    // Update user's clubs
    setCurrentUser(prev => {
      if (!prev) return null
      return {
        ...prev,
        clubs: [...prev.clubs, clubId]
      }
    })
    
    return clubId
  }

  const joinClub = (inviteLink: string): boolean => {
    if (!currentUser) return false
    
    const clubId = inviteLink.split('invite=')[1]
    const club = clubs.find(c => c.id === clubId)
    
    if (!club || club.members.includes(currentUser.id)) {
      return false
    }
    
    // Update club members
    setClubs(prev => prev.map(c => 
      c.id === clubId 
        ? { ...c, members: [...c.members, currentUser.id] }
        : c
    ))
    
    // Update user's clubs
    setCurrentUser(prev => {
      if (!prev) return null
      return {
        ...prev,
        clubs: [...prev.clubs, clubId]
      }
    })
    
    return true
  }

  const getClubById = (id: string): Club | null => {
    return clubs.find(c => c.id === id) || null
  }

  const sendMessage = (clubId: string, message: string) => {
    if (!currentUser) return
    
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clubId,
      userId: currentUser.id,
      userName: currentUser.name,
      message,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
  }

  const getClubMessages = (clubId: string): ChatMessage[] => {
    return messages.filter(m => m.clubId === clubId).sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    )
  }

  const getClubRanking = (clubId: string): User[] => {
    const club = clubs.find(c => c.id === clubId)
    if (!club) return []
    
    const savedUsers = localStorage.getItem('stellar-users')
    const users = savedUsers ? JSON.parse(savedUsers) : []
    
    return users
      .filter((u: User) => club.members.includes(u.id))
      .sort((a: User, b: User) => b.totalKm - a.totalKm)
  }

  const userClubs = clubs.filter(club => 
    currentUser && club.members.includes(currentUser.id)
  )

  const value: AppContextType = {
    currentUser,
    updateUserStats,
    clubs,
    userClubs,
    createClub,
    joinClub,
    getClubById,
    messages,
    sendMessage,
    getClubMessages,
    getClubRanking,
    selectedClub,
    setSelectedClub
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}