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
    // Integrate with Farcaster sharing
    const shareText = `Just created $${details.symbol} with ${details.wordCount} words! Day ${details.dayNumber} of my writing streak on 111words 🔥`

    // This would integrate with Farcaster's sharing API
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
