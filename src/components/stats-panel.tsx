"use client"

import { useState } from "react"
import type { UserStats } from "../types"

interface StatsPanelProps {
  stats: UserStats
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'recent'>('overview')

  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Tab Navigation */}
      <div className="flex border-b-4 border-black">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 text-sm font-bold border-r-4 border-black ${
            activeTab === 'overview' ? 'bg-blue-300' : 'bg-gray-100'
          }`}
        >
          📊 OVERVIEW
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 py-3 text-sm font-bold ${
            activeTab === 'recent' ? 'bg-blue-300' : 'bg-gray-100'
          }`}
        >
          🪙 RECENT COINS
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
        ) : (
          <div className="space-y-3">
            {stats.recentCoins.length > 0 ? (
              stats.recentCoins.map((coin) => (
                <div key={coin.id} className="bg-gray-100 border-2 border-black p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-sm">${coin.coinSymbol}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {coin.content.length > 50 
                          ? `${coin.content.substring(0, 50)}...` 
                          : coin.content
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {coin.wordCount} words • {new Date(coin.createdAt).toLocaleDateString()}
                      </div>
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
        )}
      </div>
    </div>
  )
}
