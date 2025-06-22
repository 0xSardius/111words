"use client"

import type { UserStats } from "../types/index"

interface StatsPanelProps {
  stats: UserStats
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-4">
      <h3 className="text-lg font-black text-center">YOUR STATS</h3>

      {/* Personal Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-yellow-300 border-2 border-black p-2 text-center">
          <div className="text-xl font-black">{stats.streak}</div>
          <div className="text-xs font-bold">STREAK</div>
        </div>
        <div className="bg-green-300 border-2 border-black p-2 text-center">
          <div className="text-xl font-black">{stats.totalCoins}</div>
          <div className="text-xs font-bold">COINS</div>
        </div>
        <div className="bg-blue-300 border-2 border-black p-2 text-center">
          <div className="text-xl font-black">{Math.floor(stats.totalWords / 1000)}K</div>
          <div className="text-xs font-bold">WORDS</div>
        </div>
      </div>

      {/* Recent Coins */}
      <div className="space-y-2">
        <h4 className="text-sm font-black">RECENT COINS</h4>
        <div className="space-y-1 max-h-20 overflow-y-auto">
          {stats.recentCoins.slice(0, 3).map((coin, index) => (
            <div key={coin.id} className="bg-gray-100 border border-black p-1 text-xs">
              <div className="flex justify-between">
                <span className="font-bold">${coin.coinSymbol}</span>
                <span>{coin.wordCount} words</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
