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

// Fetch metadata from IPFS
async function fetchIPFSMetadata(ipfsUri: string) {
  try {
    // Convert IPFS URI to HTTP URL
    const httpUrl = ipfsUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    console.log("🔍 Fetching IPFS metadata from:", httpUrl)
    
    const response = await fetch(httpUrl)
    if (!response.ok) {
      throw new Error(`IPFS fetch failed: ${response.status}`)
    }
    
    const metadata = await response.json()
    console.log("📝 IPFS metadata fetched:", { hasContent: !!metadata.content, wordCount: metadata.content?.split(' ').length })
    
    return metadata
  } catch (error) {
    console.error("Failed to fetch IPFS metadata:", error)
    return null
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

      // Try to fetch writing data from database first
      console.log("🔍 Fetching writing data for address:", address)
      writingData = await getWritingByCoinAddress(address)
      console.log("📝 Database writing data result:", writingData)

      // If no writing data from database, try IPFS metadata
      const metadataUri = (coin as any).uri || (coin as any).metadataUri || (coin as any).tokenURI
      if (!writingData && metadataUri) {
        console.log("🔍 No database data, trying IPFS metadata from:", metadataUri)
        const metadata = await fetchIPFSMetadata(metadataUri)
        
        if (metadata && metadata.content) {
          // Extract username from metadata attributes
          const usernameAttr = metadata.attributes?.find((attr: any) => attr.trait_type === "Creator Username")
          const wordCountAttr = metadata.attributes?.find((attr: any) => attr.trait_type === "Word Count")
          
          writingData = {
            content: metadata.content,
            word_count: wordCountAttr ? parseInt(wordCountAttr.value) : metadata.content.split(' ').length,
            created_at: coin.createdAt || new Date().toISOString(),
            user: {
              username: usernameAttr?.value || "anonymous",
              display_name: usernameAttr?.value || "Anonymous Writer"
            }
          }
          console.log("✅ Successfully fetched writing from IPFS metadata")
        }
      }
    }

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