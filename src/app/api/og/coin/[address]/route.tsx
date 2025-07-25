import { ImageResponse } from 'next/og'
import { getCoin, setApiKey } from "@zoralabs/coins-sdk"
import { getWritingByCoinAddress } from "../../../../../lib/supabase"
import { isAddress } from "viem"

// Set up Zora API key
if (process.env.ZORA_API_KEY) {
  setApiKey(process.env.ZORA_API_KEY)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params

    if (!isAddress(address)) {
      throw new Error("Invalid address")
    }

    // Fetch coin and writing data
    const coinResponse = await getCoin({
      address: address,
      chain: 8453 // Base
    })

    let coinSymbol = "UNKNOWN"
    let coinName = "Writing Coin"
    let writingContent = "Discover this writing coin on 111words"
    let authorName = "Anonymous"
    let wordCount = 0

    if (coinResponse.data?.zora20Token) {
      const coin = coinResponse.data.zora20Token
      coinSymbol = coin.symbol
      coinName = coin.name

      // Try to get writing content
      const writingData = await getWritingByCoinAddress(address)
      if (writingData) {
        writingContent = writingData.content.substring(0, 150) + (writingData.content.length > 150 ? '...' : '')
        authorName = writingData.user.display_name
        wordCount = writingData.word_count
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundImage: 'linear-gradient(45deg, #c084fc, #f472b6, #fbbf24)',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              border: '4px solid black',
              borderRadius: '8px',
              padding: '20px',
              margin: '20px',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
              width: '90%',
              maxWidth: '700px',
            }}
          >
            {/* Coin Symbol */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 900,
                color: 'black',
                marginBottom: '10px',
              }}
            >
              ${coinSymbol}
            </div>

            {/* Author & Word Count */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fbbf24',
                border: '2px solid black',
                borderRadius: '4px',
                padding: '8px 16px',
                marginBottom: '20px',
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'black' }}>
                By {authorName} • {wordCount} words
              </span>
            </div>

            {/* Writing Preview */}
            <div
              style={{
                fontSize: '18px',
                lineHeight: '1.4',
                color: '#374151',
                textAlign: 'center',
                marginBottom: '20px',
                fontStyle: 'italic',
              }}
            >
              "{writingContent}"
            </div>

            {/* 111words Branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  color: 'black',
                }}
              >
                111WORDS
              </span>
              <span
                style={{
                  fontSize: '16px',
                  color: '#6b7280',
                }}
              >
                Daily writing as ERC-20 coins
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    
    // Fallback image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundImage: 'linear-gradient(45deg, #c084fc, #f472b6, #fbbf24)',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              border: '4px solid black',
              borderRadius: '8px',
              padding: '40px',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
            }}
          >
            <div style={{ fontSize: '64px', fontWeight: 900, marginBottom: '20px' }}>
              111WORDS
            </div>
            <div style={{ fontSize: '24px', color: '#6b7280' }}>
              Daily writing as ERC-20 coins
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
      }
    )
  }
} 