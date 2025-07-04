"use client"

import { useState, useEffect, useCallback } from "react"
import { useMiniApp } from "@neynar/react"
import { useConnect } from "wagmi"
import Image from "next/image"
import { WritingInterface } from "../components/writing-interface"
import { StatsPanel } from "../components/stats-panel"
import { QuickSignInButton } from "../components/ui/QuickSignInButton"
import { validateCoinParams } from "../lib/coins"
import { useCoinCreation } from "../hooks/useCoinCreation"
import { useQuickAuth } from "../hooks/useQuickAuth"
import { 
  getUserByFid, 
  createUser, 
  createWritingAndUpdateUser, 
  getUserWritings,
  type Writing
} from "../lib/supabase"
import type { User, UserStats } from "../types/index"

interface MiniAppProps {
  onCoinCreated?: (details: { symbol: string; address: string; wordCount: number; dayNumber: number; content: string }) => void
}

export default function MiniApp({ onCoinCreated }: MiniAppProps) {
  const { actions } = useMiniApp()
  const { isAuthenticated, user: authUser } = useQuickAuth()
  const { createCoin, isConnected, canCreateCoin } = useCoinCreation()
  const { connect, connectors } = useConnect()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddPrompt, setShowAddPrompt] = useState(false)

  // Signal ready when authenticated
  useEffect(() => {
    if (isAuthenticated && actions?.ready) {
      actions.ready()
    }
  }, [isAuthenticated, actions])

  // Auto-connect to Farcaster frame wallet when authenticated but not connected
  useEffect(() => {
    if (isAuthenticated && !isConnected && connectors.length > 0) {
      console.log("🔗 Attempting to connect to Farcaster frame wallet...");
      console.log("🔍 Available connectors:", connectors.map(c => ({ id: c.id, name: c.name, type: c.type })));
      
      const farcasterConnector = connectors.find(c => 
        c.name.toLowerCase().includes('farcaster') || 
        c.id === 'farcasterFrame' || 
        c.type === 'farcasterFrame'
      );
      
      if (farcasterConnector) {
        console.log("🎯 Found Farcaster connector:", { id: farcasterConnector.id, name: farcasterConnector.name, type: farcasterConnector.type });
        connect({ connector: farcasterConnector });
      } else {
        console.log("⚠️ No Farcaster connector found. Trying first connector...");
        if (connectors[0]) {
          console.log("🔄 Connecting to first available connector:", connectors[0].name);
          connect({ connector: connectors[0] });
        }
      }
    }
  }, [isAuthenticated, isConnected, connect, connectors])

  const loadUserData = useCallback(async () => {
    if (!isAuthenticated || !authUser) {
      return
    }

    try {
      setIsLoading(true)
      const currentFid = authUser.fid
      
      // Try to get existing user
      let dbUser = await getUserByFid(currentFid)
      
      // Create user if doesn't exist
      if (!dbUser) {
        dbUser = await createUser({
          fid: currentFid,
          username: authUser.username || `user_${currentFid}`,
          display_name: authUser.displayName || "Daily Writer",
          pfp_url: authUser.pfpUrl || "/icon.png"
        })
      }

      if (dbUser) {
        // Convert DB user to UI user format
        const uiUser: User = {
          fid: dbUser.fid,
          username: dbUser.username || authUser.username || `user_${currentFid}`,
          displayName: dbUser.display_name || authUser.displayName || "Daily Writer",
          pfpUrl: dbUser.pfp_url || authUser.pfpUrl || "/icon.png",
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
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, authUser])

  // Load user data when auth state changes
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

      // No daily limits - users can create multiple coins per day for hackathon demo

      // Validate coin creation parameters
      const coinParams = {
        content,
        wordCount,
        streakDay,
        userFid: user.fid,
        userAddress: "0x0000000000000000000000000000000000000000", // Will be replaced by hook
        username: user.username,
        totalCoins: user.totalCoins,
      }

      if (!validateCoinParams(coinParams)) {
        throw new Error("Invalid coin creation parameters")
      }

      // Create coin using our new hook
      console.log("🪙 Creating coin with params:", { content: content.substring(0, 50) + "...", wordCount, streakDay, userFid: user.fid })
      const result = await createCoin(content, wordCount, streakDay, user.fid, user.username, user.totalCoins)
      console.log("🪙 Coin creation result:", result)

      if (!result.success) {
        throw new Error(result.error || "Failed to create coin")
      }

      // Save to database using our atomic function
      console.log("💾 Saving to database with params:", { fid: user.fid, wordCount, streakDay, coinAddress: result.coinAddress })
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
      console.log("💾 Database result:", dbResult)

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
        console.log("🔥 About to call success callback:", { hasCallback: !!onCoinCreated, coinAddress: result.coinAddress, symbol: result.symbol })
        if (onCoinCreated && result.coinAddress && result.symbol) {
          const callbackData = {
            symbol: result.symbol,
            address: result.coinAddress,
            wordCount,
            dayNumber: streakDay,
            content,
          }
          console.log("🚀 Calling onCoinCreated with:", callbackData)
          onCoinCreated(callbackData)
          
          // Show add prompt after first coin creation
          if (user.totalCoins === 0) {
            setShowAddPrompt(true)
          }
        } else {
          console.log("❌ Not calling callback - missing data:", { hasCallback: !!onCoinCreated, coinAddress: result.coinAddress, symbol: result.symbol })
        }

        // Skip automatic sharing - let user choose via success screen
        console.log("Coin created successfully, showing success screen")
      }
    } catch (error) {
      console.error("Failed to create coin:", error)
      alert(`❌ Failed to create coin: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      // Always reset the creating state, even if there's an error
      setIsCreating(false)
      console.log("Coin creation process completed, resetting loading state")
    }
  }

  if (isLoading || !user || !stats) {
    return (
      <div className="w-full max-w-sm mx-auto h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 flex items-center justify-center">
        <div className="text-center">
          <Image 
            src="/icon.png" 
            alt="111words" 
            width={64}
            height={64}
            className="mx-auto mb-4 rounded-xl border-2 border-black"
          />
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-black mb-2">111WORDS</h1>
          <p className="text-lg font-bold">Loading...</p>
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
              <Image
                src={user.pfpUrl || "/icon.png"}
                alt={user.displayName}
                width={40}
                height={40}
                className="rounded-full border-2 border-black"
                onError={(e) => {
                  console.log("🖼️ Profile picture failed to load, using fallback");
                  const img = e.target as HTMLImageElement;
                  if (img.src !== "/icon.png") {
                    img.src = "/icon.png";
                  }
                }}
              />
              <div>
                <h1 className="text-2xl font-black">111WORDS</h1>
                <p className="text-sm font-bold text-gray-600">@{user.username}</p>
                {isAuthenticated && (
                  <p className="text-xs text-green-600 font-bold">✅ Authenticated</p>
                )}
                {isConnected ? (
                  <p className="text-xs text-blue-600 font-bold">🔗 Wallet Connected</p>
                ) : (
                  <p className="text-xs text-orange-600 font-bold">⚠️ Wallet Disconnected</p>
                )}
                <p className="text-xs text-gray-500">
                  Real tx: {canCreateCoin ? '✅' : '❌'}
                </p>
              </div>
            </div>
            <div className="bg-orange-300 border-2 border-black px-3 py-1">
              <div className="text-lg font-black">{user.streak}</div>
              <div className="text-xs font-bold">STREAK</div>
            </div>
          </div>
        </div>

        {/* Quick Sign In Button */}
        <QuickSignInButton />

        {/* Add Mini App Prompt */}
        {showAddPrompt && actions?.addMiniApp && (
          <div className="bg-blue-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black">📱 Add 111words</h3>
                <p className="text-sm text-gray-600">Save this app for quick access!</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    actions.addMiniApp()
                    setShowAddPrompt(false)
                  }}
                  className="bg-green-500 text-white px-3 py-1 border-2 border-black font-bold text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddPrompt(false)}
                  className="bg-gray-300 px-3 py-1 border-2 border-black font-bold text-sm"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Writing Interface */}
        <WritingInterface onCreateCoin={handleCreateCoin} isCreating={isCreating} />

        {/* Stats Panel */}
        <StatsPanel stats={stats} userFid={user.fid} />

        {/* Footer */}
        <div className="bg-black text-white p-3 text-center border-4 border-black">
          <p className="text-xs font-bold">💎 POWERED BY ZORA COINS V4 ON BASE</p>
        </div>
      </div>
    </div>
  )
}
