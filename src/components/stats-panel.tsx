"use client"

import { useState, useEffect, useCallback } from "react"
import type { UserStats } from "../types"
import { getAllUserWritings } from "../lib/supabase"
import type { Writing } from "../lib/supabase"

interface StatsPanelProps {
  stats: UserStats
  userFid?: number
}

export function StatsPanel({ stats, userFid }: StatsPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'recent' | 'all'>('overview')
  const [allWritings, setAllWritings] = useState<Writing[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)

  const handleCoinClick = (coinAddress: string | undefined) => {
    if (coinAddress) {
      // Open the coin detail page for trading and reading
      window.open(`/coin/${coinAddress}`, '_blank')
    }
  }

  const loadAllWritings = useCallback(async () => {
    if (!userFid || isLoading) return
    
    setIsLoading(true)
    try {
      const result = await getAllUserWritings(userFid, 0, 20)
      setAllWritings(result.writings)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error('Error loading all writings:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userFid, isLoading])

  // Load all writings when switching to "all" tab
  useEffect(() => {
    if (activeTab === 'all' && allWritings.length === 0) {
      loadAllWritings()
    }
  }, [activeTab, allWritings.length, loadAllWritings])

  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Tab Navigation */}
      <div className="flex border-b-4 border-black">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 text-xs font-bold border-r-4 border-black ${
            activeTab === 'overview' ? 'bg-blue-300' : 'bg-gray-100'
          }`}
        >
          📊 OVERVIEW
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 py-3 text-xs font-bold border-r-4 border-black ${
            activeTab === 'recent' ? 'bg-blue-300' : 'bg-gray-100'
          }`}
        >
          🪙 RECENT
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 text-xs font-bold ${
            activeTab === 'all' ? 'bg-blue-300' : 'bg-gray-100'
          }`}
        >
          📚 ALL WRITINGS
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'overview' ? (
          <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-200 border-2 border-black p-3 text-center">
                <div className="text-2xl font-black">{stats.streak}</div>
                <div className="text-xs font-bold">DAY STREAK</div>
              </div>
              <div className="bg-green-200 border-2 border-black p-3 text-center">
                <div className="text-2xl font-black">{stats.totalCoins}</div>
                <div className="text-xs font-bold">TOTAL COINS</div>
              </div>
              <div className="bg-blue-200 border-2 border-black p-3 text-center">
                <div className="text-2xl font-black">{stats.totalWords}</div>
                <div className="text-xs font-bold">TOTAL WORDS</div>
              </div>
              <div className="bg-purple-200 border-2 border-black p-3 text-center">
                <div className="text-2xl font-black">${stats.tradingVolume}</div>
                <div className="text-xs font-bold">TRADING VOL</div>
              </div>
            </div>

            {/* Achievement Badge */}
            {stats.streak >= 7 && (
              <div className="bg-yellow-300 border-2 border-black p-3 text-center">
                <div className="text-lg font-black">🏆 WEEK WARRIOR</div>
                <div className="text-xs">7+ day streak achieved!</div>
              </div>
            )}
          </div>
        ) : activeTab === 'recent' ? (
          <div className="space-y-3">
            {stats.recentCoins.length > 0 ? (
              stats.recentCoins.map((coin) => (
                <div 
                  key={coin.id} 
                  onClick={() => handleCoinClick(coin.coinAddress)}
                  className={`bg-gray-100 border-2 border-black p-3 transition-all ${
                    coin.coinAddress 
                      ? 'cursor-pointer hover:bg-blue-100 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                      : 'cursor-default'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-sm">${coin.coinSymbol}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {coin.content.length > 80 
                          ? `${coin.content.substring(0, 80)}...` 
                          : coin.content
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {coin.wordCount} words • {new Date(coin.createdAt).toLocaleDateString()}
                      </div>
                      {coin.coinAddress && (
                        <div className="text-xs text-blue-600 font-bold mt-1">
                          👆 Click to read & trade
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-green-600">
                        {coin.coinAddress ? "✅ Minted" : "⏳ Pending"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-bold">No coins yet</div>
                <div className="text-xs">Write your first piece to mint a coin!</div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* All Writings Tab */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <div className="text-sm font-bold">Loading all writings...</div>
              </div>
            ) : allWritings.length > 0 ? (
              <>
                <div className="text-xs text-gray-600 mb-3 font-bold">
                  📚 Your Complete Writing Archive ({allWritings.length} writings)
                </div>
                {allWritings.map((writing) => (
                  <div 
                    key={writing.id} 
                    onClick={() => handleCoinClick(writing.coin_address || undefined)}
                    className={`bg-gray-100 border-2 border-black p-3 transition-all ${
                      writing.coin_address 
                        ? 'cursor-pointer hover:bg-blue-100 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                        : 'cursor-default'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold text-sm">
                          ${writing.coin_symbol || `DAY${writing.streak_day}`}
                          {writing.is_111_legend && <span className="text-yellow-600 ml-1">👑</span>}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {writing.content.length > 80 
                            ? `${writing.content.substring(0, 80)}...` 
                            : writing.content
                          }
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {writing.word_count} words • Day {writing.streak_day} • {new Date(writing.created_at).toLocaleDateString()}
                        </div>
                        {writing.coin_address && (
                          <div className="text-xs text-blue-600 font-bold mt-1">
                            👆 Click to read & trade
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-green-600">
                          {writing.coin_address ? "✅ Minted" : "⏳ Pending"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {hasMore && (
                  <button 
                    onClick={loadAllWritings}
                    className="w-full py-2 text-xs font-bold bg-blue-200 border-2 border-black hover:bg-blue-300"
                  >
                    📖 Load More Writings
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-2xl mb-2">📚</div>
                <div className="text-sm font-bold">No writings yet</div>
                <div className="text-xs">Start your writing journey!</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
