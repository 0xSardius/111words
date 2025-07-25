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

  console.log("🔍 Render state:", { showSuccess, coinDetails })

  if (showSuccess && coinDetails) {
    console.log("✅ Rendering success flow")
    return (
      <SuccessFlow
        coinDetails={coinDetails}
        onComplete={handleSuccessComplete}
      />
    )
  }

  console.log("📝 Rendering main app")
  return <MiniApp onCoinCreated={handleCoinCreated} />
}
