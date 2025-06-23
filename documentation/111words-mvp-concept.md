# DailyMint - Coinathon-Compliant Simplified MVP

## ✅ Working Within Coinathon Constraints

### Required Elements (Non-Negotiable)
- ✅ **Coins v4 SDK**: Every creation becomes an ERC-20 coin
- ✅ **Miniapp**: Must work as Farcaster Frame/miniapp
- ✅ **Zora Protocol**: Built on Zora's coin infrastructure
- ✅ **Base Network**: Where coins deploy + trade

### Core Hypothesis (Simplified)
**"People will create daily content when it becomes instantly tradeable value"**

## 🎯 Dramatically Simplified MVP (2-3 Days)

### What You KEEP (Coinathon Essentials)
- ✅ Daily writing prompts (3 hardcoded, cycling)
- ✅ Text creation form (100-300 words)
- ✅ **Coins v4 minting** (each creation = new ERC-20 coin)
- ✅ Streak tracking (simple counter)
- ✅ Farcaster Frame integration (miniapp requirement)
- ✅ Share button (Farcaster compose with coin link)

### What You REMOVE (For Phase 1)
- ❌ Complex AI prompt generation
- ❌ User profiles/accounts (use FC context)
- ❌ Public galleries
- ❌ Token reward systems
- ❌ Leaderboards
- ❌ Collections
- ❌ Advanced social features

## 🛠️ Ultra-Simple Tech Stack

```typescript
// Coinathon-focused stack
- Next.js 14 (App Router + Frame SDK)
- Farcaster Frame SDK (miniapp requirement)  
- @zoralabs/coins-sdk (required)
- Viem + Wagmi (for blockchain interactions)
- Upstash Redis (simple data storage)
- No database needed initially!
```

## 🚀 Redis-Only Data Model (No Database)

```typescript
// Store everything in Redis for speed
interface UserStreak {
  fid: string;
  currentStreak: number;
  lastCreationDate: string;
  totalCoins: number;
}

interface Creation {
  id: string;
  fid: string;
  content: string;
  prompt: string;
  coinAddress?: string;
  createdAt: string;
  day: number;
}

// Redis keys
// user:streak:{fid} -> UserStreak
// user:creation:{fid}:{date} -> Creation
// daily:prompt:{date} -> string
```

## 📝 Core User Flow (Dead Simple)

1. **Open Frame** in Warpcast → Auto-auth via FC context
2. **See prompt** → "Write about something that surprised you today"
3. **Write response** → 100-300 words in textarea
4. **Hit "Create Coin"** → Mints ERC-20 coin via Coins v4 SDK
5. **Success screen** → Shows coin address + trading link + share button
6. **Share to FC** → Auto-compose cast with coin embed

## 💎 Coins v4 Integration (Core Magic)

```typescript
// Dead simple coin creation
import { createCoin } from "@zoralabs/coins-sdk";

async function mintDailyCreation(content: string, prompt: string, userAddress: string) {
  const coinParams = {
    name: `Day ${streak} Creation`,
    symbol: `DAY${streak}`,
    uri: await uploadMetadata({
      name: `Daily Creation - ${new Date().toLocaleDateString()}`,
      description: `Prompt: ${prompt}\n\n${content}`,
      content: content,
      attributes: [
        { trait_type: "Day", value: streak.toString() },
        { trait_type: "Creation Date", value: new Date().toISOString() }
      ]
    }),
    payoutRecipient: userAddress,
    initialPurchaseWei: 0n
  };
  
  const result = await createCoin(coinParams, walletClient, publicClient);
  
  // Save to Redis
  await redis.set(`user:creation:${fid}:${today}`, {
    content,
    coinAddress: result.address,
    day: streak
  });
  
  return result;
}
```

## 🎪 Frame Implementation (Miniapp Core)

```typescript
// app/page.tsx - Main Frame Entry
export default function DailyMintFrame() {
  return (
    <div>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:button:1" content="Start Creating" />
      <meta property="fc:frame:post_url" content={`${NEXT_PUBLIC_URL}/api/frame`} />
      
      <div className="w-full h-full bg-yellow-400 flex flex-col items-center justify-center p-8">
        <h1 className="text-6xl font-black mb-4">DAILYMINT</h1>
        <p className="text-2xl font-bold text-center">
          Turn your daily thoughts into tradeable coins
        </p>
      </div>
    </div>
  );
}

// app/api/frame/route.ts - Frame Logic
export async function POST(req: Request) {
  const body = await req.json();
  const { untrustedData } = body;
  const fid = untrustedData.fid;
  
  // Check if user already created today
  const today = new Date().toISOString().split('T')[0];
  const existing = await redis.get(`user:creation:${fid}:${today}`);
  
  if (existing) {
    return new Response(getAlreadyCreatedFrame(existing));
  }
  
  return new Response(getCreateFrame(fid));
}

function getCreateFrame(fid: string) {
  const prompts = [
    "Write about something that surprised you today",
    "Describe a sound you heard this morning", 
    "What would you do with an extra hour?"
  ];
  const todaysPrompt = prompts[new Date().getDate() % prompts.length];
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:input:text" content="Write 100-300 words..." />
        <meta property="fc:frame:button:1" content="Create Coin" />
        <meta property="fc:frame:post_url" content="${NEXT_PUBLIC_URL}/api/create" />
      </head>
      <body>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; background: #fde047; padding: 40px;">
          <h2 style="font-size: 48px; font-weight: 900; margin-bottom: 20px;">Today's Prompt</h2>
          <p style="font-size: 24px; text-align: center; max-width: 600px;">${todaysPrompt}</p>
        </div>
      </body>
    </html>
  `;
}
```

## 🎯 3-Day Build Plan

### Day 1: Frame + Coins Setup
- [ ] Next.js Frame setup with proper meta tags
- [ ] Coins v4 SDK integration + wallet connection
- [ ] Redis setup for simple data storage
- [ ] Basic frame routing (start → create → success)
- [ ] One hardcoded prompt working

### Day 2: Coin Minting Flow
- [ ] Text input handling in frames
- [ ] Coin creation with proper metadata
- [ ] Success screen with coin address
- [ ] Basic streak counting in Redis
- [ ] Deploy to Vercel + test in Warpcast

### Day 3: Polish + Viral Features
- [ ] Share functionality (compose cast with coin)
- [ ] Visual polish (make it screenshot-worthy)
- [ ] Error handling for failed transactions
- [ ] Add 2 more rotating prompts
- [ ] Final testing + submission

## 🏆 Why This Wins the Coinathon

### Technical Alignment
- ✅ **Uses Coins v4 SDK properly** (each creation = tradeable coin)
- ✅ **True miniapp** (works entirely in Farcaster frames)
- ✅ **Leverages Zora's vision** (content as instant financial instruments)
- ✅ **Base-native** (where coin trading happens)

### Unique Value Prop
- 🎯 **First daily habit app** where every habit completion = tradeable asset
- 🚀 **Instant monetization** of creative streaks
- 💎 **Social proof** via coin trading activity
- 🔥 **FOMO mechanics** via daily coin scarcity

### Demo Day Magic
- **Live coin creation** during presentation
- **Real trading activity** on created coins
- **Viral sharing** happening in real-time
- **Simple but powerful** concept everyone understands

## 🚨 Success Metrics That Matter

### For Coinathon Judging
- **Coin creation volume**: How many daily coins minted?
- **Trading activity**: Are people actually trading the coins?
- **Retention**: Do users come back daily?
- **Social spread**: Viral coefficient through FC sharing

### Technical Demo Points
- **Frame perfection**: Buttery smooth in Warpcast
- **Instant coin creation**: <30 seconds prompt → tradeable coin
- **Real trading**: Show actual Uniswap activity
- **Social integration**: Seamless FC sharing

## 💡 Phase 2 Ideas (Post-Coinathon)

If the core concept works:
- **AI-generated prompts** based on trending topics
- **Coin bundling** (monthly collections)
- **Creator royalties** from secondary trading
- **Community challenges** with bonus rewards

## 🎪 Perfect Demo Script

**Hook**: "What if your daily writing habit created tradeable assets?"

**Demo**: 
1. Open DailyMint frame in Warpcast
2. See today's prompt: "Write about something surprising"
3. Type response live
4. Hit "Create Coin" → deploys ERC-20 in real-time
5. Share to FC → post goes viral with coin embed
6. Show Uniswap trading activity

**Impact**: "Every day you skip writing, you miss creating a potentially valuable asset."

## 🔥 Why This Approach Works

### For Users
- **Immediate value**: Writing creates tradeable assets
- **Social accountability**: Public coin creation
- **Financial upside**: Successful streaks = valuable coin series
- **Low friction**: Works entirely in FC, no app switching

### For Coinathon
- **Demonstrates Coins v4**: Perfect use case for content → coin
- **Miniapp native**: Built for FC ecosystem
- **Viral potential**: Every share brings new users
- **Technically sound**: Simple but uses all required tech

### For Long-term
- **Sustainable**: Trading fees fund development
- **Scalable**: Works for any creative habit
- **Moat**: First-mover in "habit monetization"
- **Exit potential**: Revenue through platform fees

**Bottom line: This keeps the core magic (daily creativity becomes financial assets) while being buildable in the coinathon timeframe with required tech stack.**