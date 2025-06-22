"use client"

interface CommunityPreviewProps {
  activeWriters: number
  totalCoins: number
  topWriters: Array<{ username: string; streak: number; coins: number }>
  className?: string
}

export function CommunityPreview({ activeWriters, totalCoins, topWriters, className = "" }: CommunityPreviewProps) {
  return (
    <div
      className={`w-full aspect-[1.91/1] bg-gradient-to-br from-cyan-400 via-yellow-400 to-magenta-400 p-6 ${className}`}
    >
      <div className="w-full h-full bg-white border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col justify-between">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">111WORDS COMMUNITY</h1>
          <div className="bg-green-400 border-4 border-black p-4 inline-block transform rotate-1">
            <p className="text-3xl font-black">{activeWriters} WRITERS ACTIVE TODAY 🔥</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 my-6">
          <div className="bg-yellow-300 border-4 border-black p-4 text-center transform -rotate-2">
            <div className="text-3xl font-black">{totalCoins}</div>
            <div className="text-sm font-bold">COINS MINTED</div>
          </div>
          <div className="bg-magenta-300 border-4 border-black p-4 text-center transform rotate-2">
            <div className="text-3xl font-black">{Math.floor(totalCoins * 150)}</div>
            <div className="text-sm font-bold">WORDS WRITTEN</div>
          </div>
          <div className="bg-cyan-300 border-4 border-black p-4 text-center transform -rotate-1">
            <div className="text-3xl font-black">{Math.floor(activeWriters / 7)}</div>
            <div className="text-sm font-bold">AVG STREAK</div>
          </div>
        </div>

        {/* Leaderboard Teaser */}
        <div className="bg-gray-100 border-4 border-black p-4">
          <h3 className="text-xl font-black text-center mb-3">🏆 TOP WRITERS</h3>
          <div className="space-y-2">
            {topWriters.slice(0, 3).map((writer, index) => (
              <div
                key={writer.username}
                className="flex justify-between items-center bg-white border-2 border-black p-2"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-300 border border-black w-6 h-6 flex items-center justify-center text-xs font-black">
                    {index + 1}
                  </div>
                  <span className="font-bold">@{writer.username}</span>
                </div>
                <div className="flex gap-2 text-xs font-bold">
                  <span>{writer.streak}🔥</span>
                  <span>{writer.coins}🪙</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-green-400 border-4 border-black p-3 inline-block transform rotate-1">
            <p className="text-2xl font-black">JOIN THE WRITING REVOLUTION</p>
          </div>
        </div>
      </div>
    </div>
  )
}
