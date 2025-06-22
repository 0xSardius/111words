"use client"

import { Button } from "./ui/Button"

interface CoinDetails {
  symbol: string
  address: string
  wordCount: number
  dayNumber: number
  content: string
}

interface CelebrationScreenProps {
  coinDetails: CoinDetails
  onNext: () => void
}

export function CelebrationScreen({ coinDetails, onNext }: CelebrationScreenProps) {
  return (
    <div className="w-full max-w-sm mx-auto h-screen bg-gradient-to-br from-green-400 via-yellow-400 to-orange-400 p-4 flex flex-col justify-center">
      <div className="space-y-6">
        {/* Main Celebration */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-black mb-2">COIN CREATED!</h1>
          <div className="bg-green-300 border-2 border-black p-3 mb-4">
            <div className="text-2xl font-black">DAY {coinDetails.dayNumber}</div>
            <div className="text-sm font-bold">COMPLETE</div>
          </div>
        </div>

        {/* Coin Details */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <h2 className="text-lg font-black mb-3 text-center">YOUR NEW COIN</h2>
          <div className="space-y-3">
            <div className="bg-purple-200 border-2 border-black p-3 text-center">
              <div className="text-xl font-black">${coinDetails.symbol}</div>
              <div className="text-xs font-bold text-gray-600">SYMBOL</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-200 border-2 border-black p-2 text-center">
                <div className="text-lg font-black">{coinDetails.wordCount}</div>
                <div className="text-xs font-bold">WORDS</div>
              </div>
              <div className="bg-yellow-200 border-2 border-black p-2 text-center">
                <div className="text-lg font-black">LIVE</div>
                <div className="text-xs font-bold">STATUS</div>
              </div>
            </div>
            <div className="bg-gray-100 border border-black p-2">
              <div className="text-xs font-mono break-all">{coinDetails.address}</div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onNext}
          className="w-full h-14 text-lg font-black bg-green-400 hover:bg-green-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          ✨ AMAZING! WHAT'S NEXT?
        </Button>
      </div>
    </div>
  )
}

interface SharePromptScreenProps {
  coinDetails: CoinDetails
  streakCount: number
  onShare: () => void
  onSkip: () => void
}

export function SharePromptScreen({ coinDetails, streakCount, onShare, onSkip }: SharePromptScreenProps) {
  return (
    <div className="w-full max-w-sm mx-auto h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-4 flex flex-col justify-center">
      <div className="space-y-6">
        {/* Share Header */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
          <div className="text-5xl mb-4">📢</div>
          <h1 className="text-2xl font-black mb-2">SHARE YOUR STREAK</h1>
          <p className="text-sm font-bold text-gray-700">Inspire others to start writing!</p>
        </div>

        {/* Streak Showcase */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="text-center mb-4">
            <div className="bg-orange-300 border-2 border-black p-4 inline-block">
              <div className="text-3xl font-black">{streakCount}</div>
              <div className="text-sm font-bold">DAY STREAK</div>
            </div>
          </div>
          <div className="bg-gray-100 border-2 border-black p-3 text-center">
            <p className="text-sm font-bold">
              "Just created ${coinDetails.symbol} with {coinDetails.wordCount} words! Day {coinDetails.dayNumber} of my
              writing streak on 111words 🔥"
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onShare}
            className="w-full h-14 text-lg font-black bg-pink-400 hover:bg-pink-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            🚀 SHARE TO FARCASTER
          </Button>
          <Button
            onClick={onSkip}
            variant="outline"
            className="w-full h-12 text-base font-black bg-white hover:bg-gray-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  )
}

interface NextDayTeaseScreenProps {
  nextDayNumber: number
  onClose: () => void
}

export function NextDayTeaseScreen({ nextDayNumber, onClose }: NextDayTeaseScreenProps) {
  return (
    <div className="w-full max-w-sm mx-auto h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-4 flex flex-col justify-center">
      <div className="space-y-6">
        {/* Tomorrow Header */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
          <div className="text-5xl mb-4">🌅</div>
          <h1 className="text-2xl font-black mb-2">SEE YOU TOMORROW!</h1>
          <p className="text-sm font-bold text-gray-700">Your streak continues...</p>
        </div>

        {/* Next Day Preview */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="text-center mb-4">
            <div className="bg-blue-300 border-2 border-black p-4 inline-block">
              <div className="text-3xl font-black">DAY {nextDayNumber}</div>
              <div className="text-sm font-bold">AWAITS</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-yellow-100 border-2 border-black p-3 text-center">
              <p className="text-sm font-bold">💡 Tomorrow's writing will create another unique coin</p>
            </div>
            <div className="bg-green-100 border-2 border-black p-3 text-center">
              <p className="text-sm font-bold">🔥 Keep your streak alive and watch your portfolio grow</p>
            </div>
          </div>
        </div>

        {/* Motivation */}
        <div className="bg-black text-white border-4 border-black p-4 text-center">
          <p className="text-lg font-black mb-2">WRITERS NEVER QUIT</p>
          <p className="text-sm font-bold">Every word counts. Every day matters.</p>
        </div>

        {/* Close Button */}
        <Button
          onClick={onClose}
          className="w-full h-14 text-lg font-black bg-indigo-400 hover:bg-indigo-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          ✍️ I'LL BE BACK!
        </Button>
      </div>
    </div>
  )
}
