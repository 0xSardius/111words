"use client"

import { useState } from "react"
import { WritingInterface } from "../components/writing-interface"
import { StatsPanel } from "../components/stats-panel"
import type { User, UserStats } from "../types/index"

// Mock data for development
const mockUser: User = {
  fid: 12345,
  username: "writer",
  displayName: "Daily Writer",
  pfpUrl: "/placeholder.svg?height=40&width=40",
  streak: 7,
  totalCoins: 12,
  totalWords: 15420,
}

const mockStats: UserStats = {
  streak: 7,
  totalCoins: 12,
  totalWords: 15420,
  recentCoins: [
    { id: "1", content: "", wordCount: 156, createdAt: "2024-01-15", coinSymbol: "THOUGHTS", coinAddress: "0x123" },
    { id: "2", content: "", wordCount: 203, createdAt: "2024-01-14", coinSymbol: "IDEAS", coinAddress: "0x456" },
    { id: "3", content: "", wordCount: 134, createdAt: "2024-01-13", coinSymbol: "DREAMS", coinAddress: "0x789" },
  ],
  tradingVolume: 2.4,
}

interface MiniAppProps {
  onCoinCreated?: (details: { symbol: string; address: string; wordCount: number; dayNumber: number; content: string }) => void
}

export default function MiniApp({ onCoinCreated }: MiniAppProps) {
  const [user, setUser] = useState<User>(mockUser)
  const [stats, setStats] = useState<UserStats>(mockStats)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateCoin = async (content: string) => {
    setIsCreating(true)

    try {
      // Simulate coin creation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const coinSymbol = "WORD" + Math.floor(Math.random() * 1000)
      const coinAddress = "0x" + Math.random().toString(16).substr(2, 8)
      const wordCount = content.trim().split(/\s+/).length

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalCoins: prev.totalCoins + 1,
        totalWords: prev.totalWords + wordCount,
        recentCoins: [
          {
            id: Date.now().toString(),
            content,
            wordCount,
            createdAt: new Date().toISOString(),
            coinSymbol,
            coinAddress,
          },
          ...prev.recentCoins.slice(0, 2),
        ],
      }))

      // Call the success callback if provided
      if (onCoinCreated) {
        onCoinCreated({
          symbol: coinSymbol,
          address: coinAddress,
          wordCount,
          dayNumber: user.streak + 1,
          content,
        })
      }
    } catch (error) {
      console.error("Failed to create coin:", error)
      alert("❌ Failed to create coin. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.pfpUrl || "/placeholder.svg"}
                alt={user.displayName}
                className="w-10 h-10 rounded-full border-2 border-black"
              />
              <div>
                <h1 className="text-2xl font-black">111WORDS</h1>
                <p className="text-sm font-bold text-gray-600">@{user.username}</p>
              </div>
            </div>
            <div className="bg-orange-300 border-2 border-black px-3 py-1">
              <div className="text-lg font-black">{user.streak}</div>
              <div className="text-xs font-bold">STREAK</div>
            </div>
          </div>
        </div>

        {/* Writing Interface */}
        <WritingInterface onCreateCoin={handleCreateCoin} isCreating={isCreating} />

        {/* Stats Panel */}
        <StatsPanel stats={stats} />

        {/* Footer */}
        <div className="bg-black text-white p-3 text-center border-4 border-black">
          <p className="text-xs font-bold">💎 POWERED BY ZORA COINS V4 ON BASE</p>
        </div>
      </div>
    </div>
  )
}
