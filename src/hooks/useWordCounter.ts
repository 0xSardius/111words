"use client"

import { useState, useCallback } from "react"

export function useWordCounter(initialContent = "") {
  const [content, setContent] = useState(initialContent)

  const countWords = useCallback((text: string): number => {
    if (!text.trim()) return 0
    return text.trim().split(/\s+/).length
  }, [])

  const wordCount = countWords(content)
  const progress = Math.min((wordCount / 111) * 100, 100)
  const canCreateCoin = wordCount >= 100

  return {
    content,
    setContent,
    wordCount,
    progress,
    canCreateCoin,
  }
}
