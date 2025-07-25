import { getCoin, setApiKey } from "@zoralabs/coins-sdk"
import { getWritingByCoinAddress } from "../../../lib/supabase"
import { isAddress } from "viem"
import SharePageClient from "./SharePageClient"
import { Metadata } from "next"

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

// Generate metadata for Frame embeds
export async function generateMetadata({ params }: { params: Promise<{ address: string }> }): Promise<Metadata> {
  const { address } = await params
  
  try {
    if (!isAddress(address)) {
      throw new Error("Invalid coin address")
    }

    // Fetch coin data
    const coinResponse = await getCoin({
      address: address,
      chain: 8453 // Base
    })

    let coinData: any = null
    let writingData: any = null

    if (coinResponse.data?.zora20Token) {
      const coin = coinResponse.data.zora20Token
      coinData = {
        name: coin.name,
        symbol: coin.symbol,
        description: coin.description || "",
      }

      // Try to get writing data
      writingData = await getWritingByCoinAddress(address)
      
      // Fallback to IPFS if no database data
      if (!writingData) {
        const metadataUri = (coin as Record<string, unknown>).uri || (coin as Record<string, unknown>).metadataUri
        if (metadataUri) {
          const metadata = await fetchIPFSMetadata(metadataUri as string)
          if (metadata?.content) {
            const usernameAttr = metadata.attributes?.find((attr: { trait_type: string; value: string }) => attr.trait_type === "Creator Username")
            writingData = {
              content: metadata.content,
              word_count: metadata.content.split(' ').length,
              user: {
                username: usernameAttr?.value || "anonymous",
                display_name: usernameAttr?.value || "Anonymous Writer"
              }
            }
          }
        }
      }
    }

    // Generate Frame embed for MiniApp launch
    const frameEmbed = {
      version: "1",
      imageUrl: `${process.env.NEXT_PUBLIC_URL || 'https://111words.vercel.app'}/api/og/coin/${address}`,
      button: {
        title: `Read ${coinData?.symbol || 'Writing'} in 111words`,
        action: {
          type: "launch_frame",
          name: "111words", 
          url: `${process.env.NEXT_PUBLIC_URL || 'https://111words.vercel.app'}/coin/${address}`,
          splashImageUrl: `${process.env.NEXT_PUBLIC_URL || 'https://111words.vercel.app'}/splash.png`,
          splashBackgroundColor: "#f7f7f7"
        }
      }
    }

    const title = coinData?.symbol ? `$${coinData.symbol} on 111words` : "Writing Coin on 111words"
    const description = writingData ? 
      `"${writingData.content.substring(0, 100)}${writingData.content.length > 100 ? '...' : ''}" - ${writingData.user.display_name} (${writingData.word_count} words)` :
      `Discover and trade this writing coin on 111words`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [`${process.env.NEXT_PUBLIC_URL || 'https://111words.vercel.app'}/api/og/coin/${address}`]
      },
      other: {
        "fc:frame": JSON.stringify(frameEmbed)
      }
    }

  } catch (error) {
    console.error("Error generating metadata:", error)
    
    // Fallback Frame embed
    const fallbackFrame = {
      version: "1", 
      imageUrl: `${process.env.NEXT_PUBLIC_URL || 'https://111words.vercel.app'}/icon.png`,
      button: {
        title: "Open 111words",
        action: {
          type: "launch_frame",
          name: "111words",
          url: `${process.env.NEXT_PUBLIC_URL || 'https://111words.vercel.app'}`,
          splashImageUrl: `${process.env.NEXT_PUBLIC_URL || 'https://111words.vercel.app'}/splash.png`,
          splashBackgroundColor: "#f7f7f7"
        }
      }
    }

    return {
      title: "111words - Daily Writing as Coins",
      description: "Transform your daily writing into tradeable ERC-20 coins on Base",
      other: {
        "fc:frame": JSON.stringify(fallbackFrame)
      }
    }
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
      const metadataUri = (coin as Record<string, unknown>).uri || (coin as Record<string, unknown>).metadataUri || (coin as Record<string, unknown>).tokenURI
      if (!writingData && metadataUri) {
        console.log("🔍 No database data, trying IPFS metadata from:", metadataUri)
        const metadata = await fetchIPFSMetadata(metadataUri as string)
        
        if (metadata && metadata.content) {
          // Extract username from metadata attributes
          const usernameAttr = metadata.attributes?.find((attr: { trait_type: string; value: string }) => attr.trait_type === "Creator Username")
          const wordCountAttr = metadata.attributes?.find((attr: { trait_type: string; value: string }) => attr.trait_type === "Word Count")
          
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