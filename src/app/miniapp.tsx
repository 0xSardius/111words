"use client"

import { useState, useEffect, useCallback } from "react"
import { WritingInterface } from "../components/writing-interface"
import { StatsPanel } from "../components/stats-panel"
import { SignInButton } from "../components/ui/SignInButton"
import { createWritingCoin, validateCoinParams } from "../lib/coins"
import { 
  getUserByFid, 
  createUser, 
  createWritingAndUpdateUser, 
  getUserWritings,
  checkUserWroteToday,
  type Writing
} from "../lib/supabase"
import { useSession } from "next-auth/react"
import type { User, UserStats } from "../types/index"

// Mock FID for development - replace with real auth later
const MOCK_FID = 12345

interface MiniAppProps {
  onCoinCreated?: (details: { symbol: string; address: string; wordCount: number; dayNumber: number; content: string }) => void
}

export default function MiniApp({ onCoinCreated }: MiniAppProps) {
  const { data: session } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Use real FID if authenticated, otherwise use mock FID
  const currentFid = session?.user?.fid || MOCK_FID

  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Try to get existing user
      let dbUser = await getUserByFid(currentFid)
      
      // Create user if doesn't exist
      if (!dbUser) {
        dbUser = await createUser({
          fid: currentFid,
          username: session?.user?.fid ? "farcaster_user" : "writer",
          display_name: session?.user?.fid ? "Farcaster User" : "Daily Writer",
          pfp_url: "/placeholder.svg?height=40&width=40"
        })
      }

      if (dbUser) {
        // Convert DB user to UI user format
        const uiUser: User = {
          fid: dbUser.fid,
          username: dbUser.username || "writer",
          displayName: dbUser.display_name || "Daily Writer",
          pfpUrl: dbUser.pfp_url || "/placeholder.svg?height=40&width=40",
          streak: dbUser.current_streak,
          totalCoins: dbUser.total_coins,
          totalWords: dbUser.total_words,
        }
        setUser(uiUser)

        // Load user writings for stats
        const writings = await getUserWritings(currentFid, 3)
        const recentCoins = writings.map((writing: Writing) => ({
          id: writing.id,
          content: writing.content,
          wordCount: writing.word_count,
          createdAt: writing.created_at,
          coinSymbol: writing.coin_symbol || "DAY",
          coinAddress: writing.coin_address || "",
        }))

        const uiStats: UserStats = {
          streak: dbUser.current_streak,
          totalCoins: dbUser.total_coins,
          totalWords: dbUser.total_words,
          recentCoins,
          tradingVolume: 0, // TODO: Calculate from actual trading data
        }
        setStats(uiStats)
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
      // Fallback to mock data if database fails
      setUser({
        fid: currentFid,
        username: session?.user?.fid ? "farcaster_user" : "writer",
        displayName: session?.user?.fid ? "Farcaster User" : "Daily Writer",
        pfpUrl: "/placeholder.svg?height=40&width=40",
        streak: 0,
        totalCoins: 0,
        totalWords: 0,
      })
      setStats({
        streak: 0,
        totalCoins: 0,
        totalWords: 0,
        recentCoins: [],
        tradingVolume: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentFid, session?.user?.fid])

  // Load user data on component mount or when session changes
  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  const handleCreateCoin = async (content: string) => {
    if (!user) return

    setIsCreating(true)

    try {
      const wordCount = content.trim().split(/\s+/).length
      const streakDay = user.streak + 1
      const is111Legend = wordCount >= 111

      // Check if user already wrote today
      const alreadyWroteToday = await checkUserWroteToday(user.fid)
      if (alreadyWroteToday) {
        throw new Error("You've already created a coin today! Come back tomorrow.")
      }

      // Validate coin creation parameters
      const coinParams = {
        content,
        wordCount,
        streakDay,
        userFid: user.fid,
        userAddress: "0x0000000000000000000000000000000000000000", // TODO: Get from wallet
      }

      if (!validateCoinParams(coinParams)) {
        throw new Error("Invalid coin creation parameters")
      }

      // Create coin using our service
      const result = await createWritingCoin(coinParams)

      if (!result.success) {
        throw new Error(result.error || "Failed to create coin")
      }

      // Save to database using our atomic function
      const dbResult = await createWritingAndUpdateUser({
        fid: user.fid,
        content,
        word_count: wordCount,
        streak_day: streakDay,
        is_111_legend: is111Legend,
        coin_address: result.coinAddress,
        tx_hash: result.txHash,
        coin_symbol: result.symbol,
      })

      if (dbResult) {
        // Update local state with new data
        const updatedUser: User = {
          ...user,
          streak: dbResult.user.current_streak,
          totalCoins: dbResult.user.total_coins,
          totalWords: dbResult.user.total_words,
        }
        setUser(updatedUser)

        // Update stats
        const updatedStats: UserStats = {
          streak: dbResult.user.current_streak,
          totalCoins: dbResult.user.total_coins,
          totalWords: dbResult.user.total_words,
          recentCoins: [
            {
              id: dbResult.writing.id,
              content: dbResult.writing.content,
              wordCount: dbResult.writing.word_count,
              createdAt: dbResult.writing.created_at,
              coinSymbol: dbResult.writing.coin_symbol || "DAY",
              coinAddress: dbResult.writing.coin_address || "",
            },
            ...(stats?.recentCoins.slice(0, 2) || []),
          ],
          tradingVolume: stats?.tradingVolume || 0,
        }
        setStats(updatedStats)

        // Call the success callback if provided
        if (onCoinCreated && result.coinAddress && result.symbol) {
          onCoinCreated({
            symbol: result.symbol,
            address: result.coinAddress,
            wordCount,
            dayNumber: streakDay,
            content,
          })
        }
      }
    } catch (error) {
      console.error("Failed to create coin:", error)
      alert(`❌ Failed to create coin: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-sm mx-auto h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-bold">Loading your writing streak...</p>
        </div>
      </div>
    )
  }

  if (!user || !stats) {
    return (
      <div className="w-full max-w-sm mx-auto h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-red-600">Failed to load user data</p>
          <button 
            onClick={loadUserData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
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
                {session?.user?.fid && (
                  <p className="text-xs text-green-600 font-bold">✅ Authenticated</p>
                )}
              </div>
            </div>
            <div className="bg-orange-300 border-2 border-black px-3 py-1">
              <div className="text-lg font-black">{user.streak}</div>
              <div className="text-xs font-bold">STREAK</div>
            </div>
          </div>
        </div>

        {/* Sign In Button */}
        <SignInButton />

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
