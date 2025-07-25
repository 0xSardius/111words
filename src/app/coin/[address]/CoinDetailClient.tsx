"use client"

import { setApiKey } from "@zoralabs/coins-sdk"
import { TradingInterface } from "../../../components/TradingInterface"
import { Button } from "../../../components/ui/Button"
import { ShareButton } from "../../../components/ui/Share"

// Set up Zora API key
if (process.env.ZORA_API_KEY) {
  setApiKey(process.env.ZORA_API_KEY)
}

interface CoinData {
  name: string
  symbol: string
  description: string
  totalSupply: string
  marketCap: string
  volume24h: string
  uniqueHolders: number
  creatorAddress: string
  createdAt: string
}

interface WritingData {
  content: string
  word_count: number
  created_at: string
  user: {
    username: string
    display_name: string
  }
}

interface CoinDetailClientProps {
  address: string
  initialCoinData: CoinData | null
  initialWritingData: WritingData | null
  initialError: string | null
}

export function CoinDetailClient({ 
  address, 
  initialCoinData, 
  initialWritingData, 
  initialError 
}: CoinDetailClientProps) {
  
  const formatNumber = (num: string | number) => {
    const n = typeof num === 'string' ? parseFloat(num) : num
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toString()
  }

  const formatEth = (wei: string | number) => {
    const ethValue = typeof wei === 'string' ? parseFloat(wei) : wei
    return (ethValue / 1e18).toFixed(4)
  }

  if (initialError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 flex items-center justify-center">
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-black mb-2">Coin Not Found</h2>
          <p className="text-sm text-gray-600 mb-4">{initialError}</p>
          <Button onClick={() => window.location.href = "/"}>
            ← Back to 111words
          </Button>
        </div>
      </div>
    )
  }

  if (!initialCoinData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 flex items-center justify-center">
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading coin data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        
        {/* Header */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-black mb-2">${initialCoinData.symbol}</h1>
            <div className="bg-yellow-200 border-2 border-black p-2 inline-block">
              <span className="text-sm font-bold">💎 {initialCoinData.name}</span>
            </div>
          </div>
        </div>

        {/* Writing Content */}
        {initialWritingData && (
          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="bg-blue-200 border-2 border-black p-3 mb-4">
              <h2 className="text-xl font-black">📝 The Writing</h2>
              <p className="text-xs">
                By {initialWritingData.user.display_name} • {initialWritingData.word_count} words
              </p>
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {initialWritingData.content}
            </div>
          </div>
        )}

        {/* Market Data */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="bg-green-200 border-2 border-black p-3 mb-4">
            <h2 className="text-xl font-black">📊 Market Data</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 border-2 border-black p-3">
              <div className="text-xs font-bold text-gray-600">HOLDERS</div>
              <div className="text-lg font-black">{initialCoinData.uniqueHolders}</div>
            </div>
            <div className="bg-gray-100 border-2 border-black p-3">
              <div className="text-xs font-bold text-gray-600">SUPPLY</div>
              <div className="text-lg font-black">{formatNumber(initialCoinData.totalSupply)}</div>
            </div>
            {initialCoinData.marketCap !== "0" && (
              <div className="bg-gray-100 border-2 border-black p-3">
                <div className="text-xs font-bold text-gray-600">MARKET CAP</div>
                <div className="text-lg font-black">{formatEth(initialCoinData.marketCap)} ETH</div>
              </div>
            )}
            {initialCoinData.volume24h !== "0" && (
              <div className="bg-gray-100 border-2 border-black p-3">
                <div className="text-xs font-bold text-gray-600">24H VOLUME</div>
                <div className="text-lg font-black">{formatEth(initialCoinData.volume24h)} ETH</div>
              </div>
            )}
          </div>
        </div>

        {/* In-App Trading */}
        <TradingInterface 
          coinAddress={address}
          coinSymbol={initialCoinData.symbol}
        />

        {/* Actions */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="space-y-3">
            <ShareButton 
              buttonText="🚀 Share on Farcaster"
              cast={{
                text: `Check out "${initialCoinData.name}" 💎\n\nRead the full writing and trade this coin on 111words!`,
                embeds: [window.location.href]
              }}
              className="w-full bg-purple-500 text-white font-black text-lg py-3"
            />
            <Button 
              onClick={() => window.location.href = "/"}
              variant="outline"
              className="w-full"
            >
              ✍️ Create Your Own
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}