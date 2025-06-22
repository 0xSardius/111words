"use client"

interface SuccessShareProps {
  dayNumber: number
  coinSymbol: string
  wordCount: number
  streakCount: number
  className?: string
}

export function SuccessShare({ dayNumber, coinSymbol, wordCount, streakCount, className = "" }: SuccessShareProps) {
  return (
    <div
      className={`w-full aspect-[1.91/1] bg-gradient-to-br from-magenta-400 via-yellow-400 to-cyan-400 p-6 ${className}`}
    >
      <div className="w-full h-full bg-white border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col justify-between">
        {/* Header */}
        <div className="text-center">
          <div className="bg-green-400 border-4 border-black p-4 inline-block transform -rotate-1">
            <h1 className="text-4xl font-black">DAY {dayNumber} COMPLETE! 🔥</h1>
          </div>
        </div>

        {/* Coin Stats */}
        <div className="flex justify-center gap-4 my-6">
          <div className="bg-purple-300 border-4 border-black p-6 text-center transform rotate-2">
            <div className="text-3xl font-black">${coinSymbol}</div>
            <div className="text-sm font-bold">NEW COIN</div>
          </div>
          <div className="bg-blue-300 border-4 border-black p-6 text-center transform -rotate-1">
            <div className="text-3xl font-black">{wordCount}</div>
            <div className="text-sm font-bold">WORDS</div>
          </div>
          <div className="bg-orange-300 border-4 border-black p-6 text-center transform rotate-1">
            <div className="text-3xl font-black">{streakCount}</div>
            <div className="text-sm font-bold">STREAK</div>
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="text-center">
          <div className="bg-yellow-300 border-6 border-black p-4 inline-block">
            <div className="text-6xl mb-2">🏆</div>
            <p className="text-2xl font-black">WRITER LEVEL UP!</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-cyan-300 border-4 border-black p-3 inline-block transform -rotate-1">
            <p className="text-xl font-black">START YOUR STREAK ON 111WORDS</p>
          </div>
        </div>

        {/* Branding */}
        <div className="text-center">
          <p className="text-2xl font-black">111WORDS</p>
          <p className="text-sm font-bold text-gray-600">Daily Writing → Tradeable Coins</p>
        </div>
      </div>
    </div>
  )
}
