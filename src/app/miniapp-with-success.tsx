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
    const shareText = `Just minted "${details.symbol}" with ${details.wordCount} words! 💎\n\nDay ${details.dayNumber} of my writing streak on 111words 🔥\n\n📖 Read & Buy: ${sharePageUrl}`

    // Open Farcaster compose with the share text
    if (typeof window !== 'undefined') {
      const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`
      window.open(farcasterUrl, '_blank')
    }
    
    console.log("Sharing to Farcaster:", shareText)
  }

  if (showSuccess && coinDetails) {
    return (
      <SuccessFlow
        coinDetails={coinDetails}
        onComplete={handleSuccessComplete}
        onShare={handleShare}
      />
    )
  }

  return <MiniApp onCoinCreated={handleCoinCreated} />
}
