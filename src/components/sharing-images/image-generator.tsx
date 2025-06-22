"use client"

import { DiscoveryPreview } from "./discovery-preview"
import { SuccessShare } from "../sharing-images/success-share"
import { CommunityPreview } from "./community-preview"

interface CoinDetails {
  symbol: string
  wordCount: number
  dayNumber: number
}

interface ShareImageGeneratorProps {
  type: "discovery" | "success" | "community"
  coinDetails?: CoinDetails
  streakCount?: number
  communityStats?: {
    activeWriters: number
    totalCoins: number
    topWriters: Array<{ username: string; streak: number; coins: number }>
  }
}

export function ShareImageGenerator({ type, coinDetails, streakCount, communityStats }: ShareImageGeneratorProps) {
  switch (type) {
    case "discovery":
      return <DiscoveryPreview />

    case "success":
      if (!coinDetails || !streakCount) return null
      return (
        <SuccessShare
          dayNumber={coinDetails.dayNumber}
          coinSymbol={coinDetails.symbol}
          wordCount={coinDetails.wordCount}
          streakCount={streakCount}
        />
      )

    case "community":
      if (!communityStats) return null
      return (
        <CommunityPreview
          activeWriters={communityStats.activeWriters}
          totalCoins={communityStats.totalCoins}
          topWriters={communityStats.topWriters}
        />
      )

    default:
      return null
  }
}
