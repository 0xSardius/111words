export interface User {
    fid: number
    username: string
    displayName: string
    pfpUrl: string
    streak: number
    totalCoins: number
    totalWords: number
  }
  
  export interface WritingSession {
    id: string
    content: string
    wordCount: number
    createdAt: string
    coinAddress?: string
    coinSymbol?: string
  }
  
  export interface UserStats {
    streak: number
    totalCoins: number
    totalWords: number
    recentCoins: WritingSession[]
    tradingVolume: number
  }
  