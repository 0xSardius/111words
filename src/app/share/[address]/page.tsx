"use client"

import { useState, useEffect } from "react"
import { getCoin, setApiKey } from "@zoralabs/coins-sdk"

// Set up Zora API key
if (process.env.NEXT_PUBLIC_ZORA_API_KEY) {
  setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY)
}
import { getWritingByCoinAddress } from "../../../lib/supabase"
import { Button } from "../../../components/ui/Button"
import { isAddress } from "viem"

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

export default function SharePage({ params }: { params: { address: string } }) {
  const [coinData, setCoinData] = useState<CoinData | null>(null)
  const [writingData, setWritingData] = useState<WritingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isAddress(params.address)) {
          throw new Error("Invalid coin address")
        }

        // Fetch coin data from Zora
        const coinResponse = await getCoin({
          address: params.address,
          chain: 8453 // Base
        })

        if (coinResponse.data?.zora20Token) {
          const coin = coinResponse.data.zora20Token
          setCoinData({
            name: coin.name,
            symbol: coin.symbol,
            description: coin.description || "",
            totalSupply: coin.totalSupply,
            marketCap: coin.marketCap || "0",
            volume24h: coin.volume24h || "0",
            uniqueHolders: coin.uniqueHolders || 0,
            creatorAddress: coin.creatorAddress || "",
            createdAt: coin.createdAt || ""
          })
        }

        // Fetch writing data from database
        const writing = await getWritingByCoinAddress(params.address)
        if (writing) {
          setWritingData(writing)
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load coin data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.address])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 flex items-center justify-center">
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center max-w-md">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-black mb-2">Loading Coin...</h2>
          <p className="text-sm text-gray-600">Fetching details from Zora</p>
        </div>
      </div>
    )
  }

  if (error || !coinData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 flex items-center justify-center">
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center max-w-md">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-black mb-2">Coin Not Found</h2>
          <p className="text-sm text-gray-600 mb-4">{error || "This coin doesn't exist"}</p>
          <Button onClick={() => window.location.href = "/"} className="w-full">
            🏠 Go Home
          </Button>
        </div>
      </div>
    )
  }

  const formatNumber = (num: string) => {
    const n = parseFloat(num)
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toFixed(2)
  }

  const formatEth = (wei: string) => {
    const eth = parseFloat(wei) / 1e18
    return eth.toFixed(6)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        
        {/* Header */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-black mb-2">${coinData.symbol}</h1>
            <div className="bg-yellow-200 border-2 border-black p-2 inline-block">
              <span className="text-sm font-bold">💎 {coinData.name}</span>
            </div>
          </div>
        </div>

        {/* Writing Content */}
        {writingData && (
          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="bg-blue-200 border-2 border-black p-3 mb-4">
              <h2 className="text-xl font-black">📝 The Writing</h2>
              <p className="text-xs">
                By {writingData.user.display_name} • {writingData.word_count} words
              </p>
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {writingData.content}
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
              <div className="text-lg font-black">{coinData.uniqueHolders}</div>
            </div>
            <div className="bg-gray-100 border-2 border-black p-3">
              <div className="text-xs font-bold text-gray-600">SUPPLY</div>
              <div className="text-lg font-black">{formatNumber(coinData.totalSupply)}</div>
            </div>
            {coinData.marketCap !== "0" && (
              <div className="bg-gray-100 border-2 border-black p-3">
                <div className="text-xs font-bold text-gray-600">MARKET CAP</div>
                <div className="text-lg font-black">{formatEth(coinData.marketCap)} ETH</div>
              </div>
            )}
            {coinData.volume24h !== "0" && (
              <div className="bg-gray-100 border-2 border-black p-3">
                <div className="text-xs font-bold text-gray-600">24H VOLUME</div>
                <div className="text-lg font-black">{formatEth(coinData.volume24h)} ETH</div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="space-y-3">
            <Button 
              onClick={() => window.open(`https://zora.co/collect/base:${params.address}`, '_blank')}
              className="w-full bg-green-500"
            >
              💰 Buy on Zora
            </Button>
            <Button 
              onClick={() => {
                const text = `Check out "${coinData.name}" by ${writingData?.user.display_name} 💎\n\n${window.location.href}`
                window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`, '_blank')
              }}
              variant="outline"
              className="w-full"
            >
              🚀 Share on Farcaster
            </Button>
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