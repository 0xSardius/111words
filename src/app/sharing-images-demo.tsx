"use client"

import { ShareImageGenerator } from "./components/sharing-images/image-generator"

// Mock data for demo
const mockCoinDetails = {
  symbol: "THOUGHTS",
  wordCount: 156,
  dayNumber: 15,
}

const mockCommunityStats = {
  activeWriters: 42,
  totalCoins: 1247,
  topWriters: [
    { username: "wordsmith", streak: 28, coins: 45 },
    { username: "dailywriter", streak: 21, coins: 38 },
    { username: "coinpoet", streak: 19, coins: 32 },
  ],
}

export default function SharingImagesDemo() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">111WORDS SHARING IMAGES</h1>
          <p className="text-lg font-bold text-gray-600">Preview cards for Farcaster feeds</p>
        </div>

        {/* Discovery Preview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black">🚀 Discovery Preview</h2>
          <p className="text-gray-600 font-bold">For initial marketing and user acquisition</p>
          <div className="max-w-2xl">
            <ShareImageGenerator type="discovery" />
          </div>
        </div>

        {/* Success Share */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black">🎉 Success Share</h2>
          <p className="text-gray-600 font-bold">When users share their coin creation achievements</p>
          <div className="max-w-2xl">
            <ShareImageGenerator type="success" coinDetails={mockCoinDetails} streakCount={15} />
          </div>
        </div>

        {/* Community Preview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black">👥 Community Preview</h2>
          <p className="text-gray-600 font-bold">Shows live community stats and leaderboard</p>
          <div className="max-w-2xl">
            <ShareImageGenerator type="community" communityStats={mockCommunityStats} />
          </div>
        </div>

        {/* Integration Notes */}
        <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black mb-4">🔧 Integration Notes</h3>
          <div className="space-y-2 text-sm font-bold">
            <p>• These components generate static preview cards for Farcaster</p>
            <p>• Use with html-to-image or similar library to create actual image files</p>
            <p>• Discovery: Use for marketing posts and initial user acquisition</p>
            <p>• Success: Auto-generate when users complete their daily writing</p>
            <p>• Community: Schedule periodic posts showing platform growth</p>
          </div>
        </div>
      </div>
    </div>
  )
}
