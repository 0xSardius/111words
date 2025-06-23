"use client"

import { useState } from "react"
import { Button } from "./ui/Button"

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
  onShare: (details: CoinDetails) => void
}

export function SuccessFlow({ coinDetails, streakCount, onComplete, onShare }: SuccessFlowProps) {
  const [currentStep, setCurrentStep] = useState<'minting' | 'success' | 'share'>('minting')

  // Simulate minting process
  useState(() => {
    const timer = setTimeout(() => {
      setCurrentStep('success')
    }, 2000)
    return () => clearTimeout(timer)
  })

  const handleShare = () => {
    onShare(coinDetails)
    setCurrentStep('share')
  }

  if (currentStep === 'minting') {
    return (
      <div className="w-full max-w-sm mx-auto h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 flex items-center justify-center">
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-black mb-2">Minting Your Coin</h2>
          <p className="text-sm text-gray-600">
            Creating ${coinDetails.symbol} on Base network...
          </p>
          <div className="mt-4 text-xs text-gray-500">
            This may take a few moments
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'success') {
    return (
      <div className="w-full max-w-sm mx-auto h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 flex items-center justify-center">
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black mb-2">Coin Created!</h2>
          <div className="bg-green-200 border-2 border-black p-3 mb-4">
            <div className="text-lg font-black">${coinDetails.symbol}</div>
            <div className="text-xs">Day {coinDetails.dayNumber} of your streak</div>
          </div>
          <div className="text-sm text-gray-600 mb-4">
            <p>You&apos;ve written {coinDetails.wordCount} words</p>
            <p>and minted your {coinDetails.dayNumber} coin!</p>
          </div>
          <div className="space-y-2">
            <Button onClick={handleShare} className="w-full">
              🚀 Share to Farcaster
            </Button>
            <Button onClick={onComplete} variant="outline" className="w-full">
              Continue Writing
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'share') {
    return (
      <div className="w-full max-w-sm mx-auto h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4 flex items-center justify-center">
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-black mb-2">Shared!</h2>
          <div className="bg-blue-200 border-2 border-black p-3 mb-4">
            <div className="text-sm font-bold">Your coin is now live</div>
            <div className="text-xs text-gray-600">
              Friends can buy and trade ${coinDetails.symbol}
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-4">
            <p>&ldquo;Just created ${coinDetails.symbol} with {coinDetails.wordCount} words!&rdquo;</p>
            <p>Day {coinDetails.dayNumber} of my writing streak on 111words 🔥</p>
          </div>
          <Button onClick={onComplete} className="w-full">
            🎯 Keep Writing
          </Button>
        </div>
      </div>
    )
  }

  return null
}
