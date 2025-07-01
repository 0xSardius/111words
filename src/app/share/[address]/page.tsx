import { getCoin, setApiKey } from "@zoralabs/coins-sdk"
import { getWritingByCoinAddress } from "../../../lib/supabase"
import { isAddress } from "viem"
import SharePageClient from "./SharePageClient"

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

export default async function SharePage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params

  // Server-side data fetching
  let coinData: CoinData | null = null
  let writingData: WritingData | null = null
  let error: string | null = null

  try {
    if (!isAddress(address)) {
      throw new Error("Invalid coin address")
    }

    // Fetch coin data from Zora
    const coinResponse = await getCoin({
      address: address,
      chain: 8453 // Base
    })

    if (coinResponse.data?.zora20Token) {
      const coin = coinResponse.data.zora20Token
      coinData = {
        name: coin.name,
        symbol: coin.symbol,
        description: coin.description || "",
        totalSupply: coin.totalSupply,
        marketCap: coin.marketCap || "0",
        volume24h: coin.volume24h || "0",
        uniqueHolders: coin.uniqueHolders || 0,
        creatorAddress: coin.creatorAddress || "",
        createdAt: coin.createdAt || ""
      }
    }

    // Fetch writing data from database
    writingData = await getWritingByCoinAddress(address)

  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load coin data"
  }

  return (
    <SharePageClient 
      address={address}
      initialCoinData={coinData}
      initialWritingData={writingData}
      initialError={error}
    />
  )
} 