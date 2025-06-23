import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    frame: {
      version: "1",
      name: "111words",
      iconUrl: "https://111words.vercel.app/icon.png",
      homeUrl: "https://111words.vercel.app",
      splashImageUrl: "https://111words.vercel.app/splash.png",
      splashBackgroundColor: "#f7f7f7",
      subtitle: "Daily writing as ERC-20 coins",
      description: "Write daily and mint your words as ERC-20 coins on Base. Build streaks, earn rewards, and share your creativity with the world.",
      primaryCategory: "art-creativity",
      tags: [
        "writing",
        "coins",
        "streaks",
        "creativity",
        "base"
      ],
      requiredChains: [
        "eip155:8453"
      ],
      requiredCapabilities: [
        "actions.signIn",
        "wallet.getEthereumProvider"
      ],
      heroImageUrl: "https://111words.vercel.app/icon.png",
      tagline: "Daily writing as ERC-20 coins",
      ogTitle: "111words",
      ogDescription: "Write daily and mint your words as ERC-20 coins on Base",
      ogImageUrl: "https://111words.vercel.app/icon.png"
    }
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
