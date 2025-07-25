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
    let writingContent = "Writing coin on 111words"
    let writerName = "Anonymous Writer"
    let wordCount = 0

    if (coinResponse.data?.zora20Token) {
      const coin = coinResponse.data.zora20Token
      coinSymbol = coin.symbol || "UNKNOWN"

      // Try to get writing data
      const writingData = await getWritingByCoinAddress(address)
      if (writingData) {
        writingContent = writingData.content.length > 100 
          ? `${writingData.content.substring(0, 100)}...`
          : writingData.content
        writerName = writingData.user.display_name
        wordCount = writingData.word_count
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '800px',
            display: 'flex',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #eab308 100%)',
            padding: '40px',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'white',
              border: '8px solid black',
              boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)',
              padding: '60px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{
                  background: '#fbbf24',
                  border: '6px solid black',
                  padding: '20px 40px',
                  transform: 'rotate(-2deg)',
                }}
              >
                <h1 style={{ fontSize: '72px', fontWeight: 900, margin: 0, color: 'black' }}>
                  ${coinSymbol}
                </h1>
              </div>
            </div>

            {/* Writing Preview */}
            <div
              style={{
                background: '#f3f4f6',
                border: '4px solid black',
                padding: '40px',
                margin: '40px 0',
              }}
            >
              <div
                style={{
                  background: '#dbeafe',
                  border: '3px solid black',
                  padding: '20px',
                  marginBottom: '20px',
                }}
              >
                <p style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'black' }}>
                  📝 By {writerName} • {wordCount} words
                </p>
              </div>
              <p style={{ fontSize: '32px', lineHeight: 1.4, margin: 0, color: 'black' }}>
                &ldquo;{writingContent}&rdquo;
              </p>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '48px', fontWeight: 900, margin: 0, color: 'black' }}>
                  111WORDS
                </h2>
                <p style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#6b7280' }}>
                  Daily Writing → Tradeable Coins
                </p>
              </div>
              <div
                style={{
                  background: '#10b981',
                  border: '4px solid black',
                  padding: '20px',
                  transform: 'rotate(2deg)',
                }}
              >
                <p style={{ fontSize: '32px', fontWeight: 900, margin: 0, color: 'white' }}>
                  💎 TRADE NOW
                </p>
              </div>
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
    console.error("Error generating OG image:", error)
    
    // Fallback image
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '800px',
            display: 'flex',
            background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'white',
              border: '8px solid black',
              padding: '60px',
              textAlign: 'center',
            }}
          >
            <h1 style={{ fontSize: '72px', fontWeight: 900, margin: 0, color: 'black' }}>
              111WORDS
            </h1>
            <p style={{ fontSize: '32px', margin: '20px 0', color: 'black' }}>
              Writing Coin Discovery
            </p>
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