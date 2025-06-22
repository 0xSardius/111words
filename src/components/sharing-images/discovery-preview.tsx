"use client"

interface DiscoveryPreviewProps {
  className?: string
}

export function DiscoveryPreview({ className = "" }: DiscoveryPreviewProps) {
  return (
    <div
      className={`w-full aspect-[1.91/1] bg-gradient-to-br from-yellow-400 via-magenta-400 to-cyan-400 p-6 ${className}`}
    >
      <div className="w-full h-full bg-white border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col justify-between">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-6xl font-black mb-4">111WORDS</h1>
          <div className="bg-yellow-300 border-4 border-black p-4 inline-block transform -rotate-2">
            <p className="text-2xl font-black">DAILY WRITING</p>
            <p className="text-2xl font-black">BECOMES</p>
            <p className="text-2xl font-black">TRADEABLE COINS</p>
          </div>
        </div>

        {/* Visual Elements */}
        <div className="flex justify-center items-center gap-4 my-6">
          <div className="bg-cyan-300 border-4 border-black p-4 transform rotate-3">
            <div className="text-3xl">📝</div>
            <div className="text-sm font-black">WRITE</div>
          </div>
          <div className="text-4xl font-black">→</div>
          <div className="bg-magenta-300 border-4 border-black p-4 transform -rotate-3">
            <div className="text-3xl">🪙</div>
            <div className="text-sm font-black">MINT</div>
          </div>
          <div className="text-4xl font-black">→</div>
          <div className="bg-yellow-300 border-4 border-black p-4 transform rotate-2">
            <div className="text-3xl">📈</div>
            <div className="text-sm font-black">TRADE</div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <div className="bg-green-400 border-6 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 inline-block transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <p className="text-3xl font-black">🚀 START WRITING STREAK</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-lg font-black text-gray-700">POWERED BY ZORA COINS V4 ON BASE</p>
        </div>
      </div>
    </div>
  )
}
