"use client"

import { useState } from "react"
import { CelebrationScreen, SharePromptScreen, NextDayTeaseScreen } from "../components/success-screens"

interface CoinDetails {
  symbol: string
  address: string
  wordCount: number
  dayNumber: number
  content: string
}

interface SuccessFlowProps {
  coinDetails: CoinDetails
  streakCount: number
  onComplete: () => void
  onShare: (coinDetails: CoinDetails) => void
}

type SuccessStep = "celebration" | "share" | "nextDay"

export function SuccessFlow({ coinDetails, streakCount, onComplete, onShare }: SuccessFlowProps) {
  const [currentStep, setCurrentStep] = useState<SuccessStep>("celebration")

  const handleCelebrationNext = () => {
    setCurrentStep("share")
  }

  const handleShare = () => {
    onShare(coinDetails)
    setCurrentStep("nextDay")
  }

  const handleSkipShare = () => {
    setCurrentStep("nextDay")
  }

  const handleComplete = () => {
    onComplete()
  }

  switch (currentStep) {
    case "celebration":
      return <CelebrationScreen coinDetails={coinDetails} onNext={handleCelebrationNext} />
    case "share":
      return (
        <SharePromptScreen
          coinDetails={coinDetails}
          streakCount={streakCount}
          onShare={handleShare}
          onSkip={handleSkipShare}
        />
      )
    case "nextDay":
      return <NextDayTeaseScreen nextDayNumber={coinDetails.dayNumber + 1} onClose={handleComplete} />
    default:
      return null
  }
}
