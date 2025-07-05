"use client"

import { useState, useEffect, useCallback } from "react"
import { getCoin } from "@zoralabs/coins-sdk"
import { Button } from "../../../components/ui/Button"
import { TradingInterface } from "../../../components/TradingInterface"

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
  const [showFullContent, setShowFullContent] = useState(false)
  const [coinData, setCoinData] = useState(initialCoinData)
  const [writingData, setWritingData] = useState(initialWritingData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(initialError)

  // Debug logging to see what data we're getting
  console.log("🔍 CoinDetailClient initialized with:", {
    address,
    hasCoinData: !!initialCoinData,
    hasWritingData: !!initialWritingData,
    writingContent: initialWritingData?.content?.substring(0, 100) + "...",
    error: initialError
  })

  // Fetch coin data from Zora SDK
  const fetchCoinData = useCallback(async () => {
    if (!address) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      console.log("🔍 Fetching coin data for:", address)
      const result = await getCoin({ address: address as `0x${string}` })
      console.log("📊 Coin data result:", result)
      
      if (result && result.data && result.data.zora20Token) {
        const coin = result.data.zora20Token
        setCoinData({
          name: coin.name || "Unknown",
          symbol: coin.symbol || "UNKNOWN",
          description: coin.description || "",
          totalSupply: coin.totalSupply || "0",
          marketCap: coin.marketCap || "0",
          volume24h: coin.volume24h || "0",
          uniqueHolders: coin.uniqueHolders || 0,
          creatorAddress: coin.creatorAddress || "",
          createdAt: coin.createdAt || ""
        })
        
        // DON'T override writing data - keep the data from database
        // Writing content comes from Supabase, not from Zora SDK
        console.log("✅ Using writing data from database, not overriding with Zora data")
      }
    } catch (err) {
      console.error("❌ Error fetching coin data:", err)
      setError(`Failed to fetch coin data: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }, [address])

  // Fetch coin data on mount if we don't have it
  useEffect(() => {
    if (!coinData && !error) {
      console.log("🔄 No initial coin data, fetching from Zora SDK")
      fetchCoinData()
    } else {
      console.log("✅ Using initial coin data from server")
    }
  }, [address, coinData, error, fetchCoinData])
  
  if (error || (!coinData && !isLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 flex items-center justify-center">
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center max-w-md">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-black mb-2">Coin Not Found</h2>
          <p className="text-sm text-gray-600 mb-4">{error || "This coin doesn't exist"}</p>
          <div className="space-y-2">
            <Button onClick={fetchCoinData} className="w-full bg-blue-500 text-white">
              🔄 Try Again
            </Button>
            <Button onClick={() => window.location.href = "/"} className="w-full">
              🏠 Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 flex items-center justify-center">
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center max-w-md">
          <div className="text-6xl mb-4">🔄</div>
          <h2 className="text-2xl font-black mb-2">Loading Coin...</h2>
          <p className="text-sm text-gray-600">Fetching writing content</p>
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
            <h1 className="text-3xl font-black mb-2">${coinData?.symbol}</h1>
            <div className="bg-yellow-200 border-2 border-black p-2 inline-block">
              <span className="text-sm font-bold">💎 {coinData?.name}</span>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gray-100 border-2 border-black p-2 text-center">
              <div className="text-lg font-black">{coinData?.uniqueHolders || 0}</div>
              <div className="text-xs font-bold text-gray-600">HOLDERS</div>
            </div>
            <div className="bg-gray-100 border-2 border-black p-2 text-center">
              <div className="text-lg font-black">{formatNumber(coinData?.totalSupply || "0")}</div>
              <div className="text-xs font-bold text-gray-600">SUPPLY</div>
            </div>
          </div>
        </div>

        {/* Trading Interface - Prominently displayed */}
        <TradingInterface 
          coinAddress={address}
          coinSymbol={coinData?.symbol || "UNKNOWN"}
        />

        {/* Writing Content - Now with proper expand/collapse */}
        {writingData && (
          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="bg-blue-200 border-2 border-black p-3 mb-4">
              <h2 className="text-lg font-black">📝 The Writing</h2>
              <p className="text-xs">
                By {writingData.user.display_name} • {writingData.word_count} words
              </p>
            </div>
            
            {/* Full content with expand/collapse */}
            <div className="text-sm leading-relaxed">
              {writingData.content.length > 300 && !showFullContent ? (
                <div>
                  <div className="whitespace-pre-wrap">
                    {writingData.content.substring(0, 300)}...
                  </div>
                  <Button 
                    onClick={() => setShowFullContent(true)}
                    variant="outline"
                    className="mt-3 text-xs"
                  >
                    📖 Read Full Writing
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="whitespace-pre-wrap">
                    {writingData.content}
                  </div>
                  {writingData.content.length > 300 && (
                    <Button 
                      onClick={() => setShowFullContent(false)}
                      variant="outline"
                      className="mt-3 text-xs"
                    >
                      📖 Show Less
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Market Data - Condensed */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="bg-green-200 border-2 border-black p-3 mb-4">
            <h2 className="text-lg font-black">📊 Market Data</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {coinData?.marketCap !== "0" && (
              <div className="bg-gray-100 border-2 border-black p-2">
                <div className="text-xs font-bold text-gray-600">MARKET CAP</div>
                <div className="text-sm font-black">{formatEth(coinData?.marketCap || "0")} ETH</div>
              </div>
            )}
            {coinData?.volume24h !== "0" && (
              <div className="bg-gray-100 border-2 border-black p-2">
                <div className="text-xs font-bold text-gray-600">24H VOLUME</div>
                <div className="text-sm font-black">{formatEth(coinData?.volume24h || "0")} ETH</div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="space-y-3">
            <Button 
              onClick={() => {
                const text = `Check out "${coinData?.name}" 💎\n\n${window.location.href}`
                if (navigator.share) {
                  navigator.share({
                    title: `${coinData?.name} - 111words`,
                    text: text,
                    url: window.location.href
                  })
                } else {
                  window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`, '_blank')
                }
              }}
              className="w-full bg-purple-500 text-white font-black text-lg py-3"
            >
              🚀 Share This Writing
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

export default CoinDetailClient