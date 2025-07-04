"use client"

import { useState } from "react"
import MiniApp from "./miniapp"
import { SuccessFlow } from "../components/success-screens"

interface CoinDetails {
  symbol: string
  address: string
  wordCount: number
  dayNumber: number
  content: string
}

export default function MiniAppWithSuccess() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [coinDetails, setCoinDetails] = useState<CoinDetails | null>(null)

  const handleCoinCreated = (details: CoinDetails) => {
    console.log("🎉 Success callback triggered with details:", details)
    setCoinDetails(details)
    setShowSuccess(true)
  }

  const handleSuccessComplete = () => {
    setShowSuccess(false)
    setCoinDetails(null)
    // Could redirect back to main app or reset state
  }

  const handleShare = (details: CoinDetails) => {
    // Create enhanced share text with link to our custom share page
    const sharePageUrl = `${window.location.origin}/share/${details.address}`
    const contentPreview = details.content.length > 100 
      ? `${details.content.substring(0, 100)}...` 
      : details.content
    
    const shareText = `Just minted "${details.symbol}" with ${details.wordCount} words! 💎\n\n"${contentPreview}"\n\nDay ${details.dayNumber} of my writing streak on 111words 🔥\n\n📖 Read full & Buy: ${sharePageUrl}`

    // Open Farcaster compose with the share text
    if (typeof window !== 'undefined') {
      const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`
      window.open(farcasterUrl, '_blank')
    }
    
    console.log("Sharing to Farcaster:", shareText)
  }

  console.log("🔍 Render state:", { showSuccess, coinDetails })

  if (showSuccess && coinDetails) {
    console.log("✅ Rendering success flow")
    return (
      <SuccessFlow
        coinDetails={coinDetails}
        onComplete={handleSuccessComplete}
        onShare={handleShare}
      />
    )
  }

  console.log("📝 Rendering main app")
  return <MiniApp onCoinCreated={handleCoinCreated} />
}
