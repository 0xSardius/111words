"use client"

import { useWordCounter } from "@/hooks/useWordCounter"
import { ProgressIndicator } from "./progress-indicator"
import { Button } from "./ui/Button"

interface WritingInterfaceProps {
  onCreateCoin: (content: string) => void
  isCreating: boolean
}

export function WritingInterface({ onCreateCoin, isCreating }: WritingInterfaceProps) {
  const { content, setContent, wordCount, progress, canCreateCoin } = useWordCounter()

  const handleSubmit = () => {
    if (canCreateCoin && content.trim()) {
      onCreateCoin(content)
    }
  }

  return (
    <div className="space-y-4">
      {/* Writing Area */}
      <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your thoughts... Share your ideas, stories, or insights. Make it count! 📝"
          className="w-full h-48 p-4 text-base resize-none border-none outline-none font-mono"
          disabled={isCreating}
        />
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator wordCount={wordCount} progress={progress} />

      {/* Action Button */}
      <Button
        onClick={handleSubmit}
        disabled={!canCreateCoin || isCreating}
        className={`w-full h-14 text-lg font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
          canCreateCoin ? "bg-green-400 hover:bg-green-500 text-black" : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        {isCreating ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            MINTING COIN...
          </div>
        ) : canCreateCoin ? (
          "🪙 CREATE COIN"
        ) : (
          `📝 KEEP WRITING (${100 - wordCount} more)`
        )}
      </Button>
    </div>
  )
}
