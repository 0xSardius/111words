"use client"

interface ProgressIndicatorProps {
  wordCount: number
  progress: number
}

export function ProgressIndicator({ wordCount, progress }: ProgressIndicatorProps) {
  const getProgressColor = () => {
    if (wordCount >= 111) return "bg-green-500"
    if (wordCount >= 100) return "bg-yellow-500"
    return "bg-blue-500"
  }

  const getProgressText = () => {
    if (wordCount >= 111) return "🎉 LEGENDARY!"
    if (wordCount >= 100) return "✨ READY TO MINT!"
    return "📝 KEEP WRITING..."
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-700">{wordCount}/111+ words</span>
        <span className="text-xs font-bold text-gray-600">{getProgressText()}</span>
      </div>
      <div className="w-full h-3 bg-gray-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div className={`h-full transition-all duration-300 ${getProgressColor()}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
