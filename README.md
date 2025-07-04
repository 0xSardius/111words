# 111words 📝💎

> Turn your daily thoughts into tradeable coins on Base

**111words** is a Farcaster MiniApp that transforms daily writing into ERC-20 coins using Zora's Coins v4 SDK. Write, mint, and trade your creative expression on the blockchain.

![111words Demo](public/splash.png)

## 🎯 Concept

Every day, users write between 100-300 words about anything - thoughts, stories, insights, or creative expression. Each piece of writing becomes a unique ERC-20 coin that can be traded on Zora's marketplace.

### Why 111words?

- **Daily Creativity**: Encourages consistent creative expression
- **Monetized Writing**: Your words become tradeable assets
- **Community Building**: Discover and trade others' creative coins
- **Streak Rewards**: Build writing streaks for increasing coin value
- **111 Legend Status**: Write 111+ words to achieve special recognition

## ✨ Features

### 🖊️ Writing Interface
- Clean, distraction-free writing experience
- Real-time word counter with progress indicator
- 100-300 word target range
- Instant feedback and validation

### 🪙 Coin Creation
- **Real ERC-20 coins** minted on Base network
- **IPFS metadata storage** with full writing content
- **Unique coin symbols** based on username and streak
- **Dynamic naming** reflecting writing journey
- **Rich metadata** with word count, streak day, and creation date

### 📊 User Dashboard
- Personal writing statistics
- Current streak tracking
- Total coins and words written
- Recent coin previews
- Achievement badges

### 🚀 Social Features
- **Share to Farcaster** with custom share pages
- **Beautiful share pages** with full writing content and market data
- **Trading integration** via Zora marketplace
- **MiniApp installation** prompts for user retention

### 💰 Trading & Discovery
- **Live market data** from Zora SDK
- **Direct trading links** to Zora marketplace
- **Coin details pages** with full writing content
- **Community discovery** (coming soon)

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Neobrutalist Design** - Bold, distinctive UI

### Blockchain & Web3
- **Zora Coins v4 SDK** - ERC-20 coin creation and trading
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **Base Network** - Layer 2 for fast, cheap transactions

### Farcaster Integration
- **@neynar/react** - Farcaster MiniApp framework
- **Farcaster Frame Connector** - Wallet integration
- **MiniApp Manifest** - Proper app registration

### Data & Storage
- **Supabase** - PostgreSQL database with real-time features
- **IPFS via Pinata** - Decentralized metadata storage
- **Row Level Security** - Secure data access

### Deployment
- **Vercel** - Serverless deployment and hosting
- **Environment Management** - Secure API key handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Pinata account (for IPFS)
- Zora API key
- Farcaster account for testing

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/111words.git
cd 111words
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# IPFS Storage
PINATA_JWT=your_pinata_jwt_token

# Zora SDK
ZORA_API_KEY=your_zora_api_key

# MiniApp Configuration
NEXT_PUBLIC_MINI_APP_NAME="111words"
NEXT_PUBLIC_MINI_APP_DESCRIPTION="Turn your daily thoughts into tradeable coins"
NEXT_PUBLIC_MINI_APP_BUTTON_TEXT="Start Writing"
NEXT_PUBLIC_MINI_APP_PRIMARY_CATEGORY="social"
NEXT_PUBLIC_MINI_APP_TAGS="writing,creativity,coins"

# Deployment
NEXT_PUBLIC_URL=https://your-domain.vercel.app
MINI_APP_FID=your_farcaster_fid
MINI_APP_MNEMONIC=your_wallet_mnemonic
```

4. **Set up the database**

Run the SQL schema from `documentation/111words-sql-query.md` in your Supabase dashboard:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fid BIGINT UNIQUE NOT NULL,
  username TEXT,
  display_name TEXT,
  pfp_url TEXT,
  current_streak INTEGER DEFAULT 0,
  total_coins INTEGER DEFAULT 0,
  total_words INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create writings table  
CREATE TABLE writings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  fid BIGINT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  streak_day INTEGER NOT NULL,
  coin_address TEXT,
  coin_symbol TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes and RLS policies
-- (See full schema in documentation/)
```

5. **Configure Pinata for IPFS**
- Create account at [pinata.cloud](https://pinata.cloud)
- Generate API key with Files: CREATE, READ permissions
- Add JWT token to environment variables

6. **Get Zora API Key**
- Create account on [Zora](https://zora.co)
- Navigate to Developer Settings
- Create API key and add to environment variables

7. **Run the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app running.

### Testing in Farcaster

1. **Deploy to Vercel**
```bash
npm run build
# Deploy to Vercel via GitHub integration or CLI
```

2. **Test the MiniApp**
- Open Farcaster (Warpcast)
- Navigate to your deployed URL
- The app should authenticate automatically
- Try writing and minting a coin

## 📖 Usage

### For Users

1. **Open the MiniApp** in Farcaster
2. **Write your thoughts** (100-300 words)
3. **Click "Create Coin"** to mint your ERC-20 token
4. **Share your coin** to Farcaster or view details
5. **Build your streak** by writing daily
6. **Trade coins** on Zora marketplace

### For Developers

#### Creating Coins
```typescript
import { createWritingCoin } from './lib/coins'

const result = await createWritingCoin({
  content: "Your writing content...",
  wordCount: 150,
  streakDay: 5,
  userFid: 12345,
  userAddress: "0x...",
  username: "writer",
  totalCoins: 4
}, walletClient, publicClient)
```

#### Querying Coins
```typescript
import { getCoin } from '@zoralabs/coins-sdk'

const coinData = await getCoin({
  address: "0x...",
  chain: 8453 // Base
})
```

#### Database Operations
```typescript
import { createWritingAndUpdateUser } from './lib/supabase'

const result = await createWritingAndUpdateUser({
  fid: 12345,
  content: "Writing content...",
  word_count: 150,
  streak_day: 5,
  coin_address: "0x...",
  coin_symbol: "WRITE5"
})
```

## 🏗️ Architecture

### Data Flow
1. **User writes** in the interface
2. **Metadata created** with writing content
3. **IPFS upload** via Pinata API
4. **Coin minted** on Base using Zora SDK
5. **Database updated** with coin details
6. **Success screen** shows coin info and sharing options

### Key Components

- `src/app/miniapp.tsx` - Main application logic
- `src/lib/coins.ts` - Coin creation and Zora SDK integration
- `src/lib/supabase.ts` - Database operations
- `src/components/writing-interface.tsx` - Writing UI
- `src/components/stats-panel.tsx` - User dashboard
- `src/app/share/[address]/` - Coin detail pages

### Database Schema

- **users** - Farcaster user profiles and stats
- **writings** - Individual writing pieces and coin data
- **Atomic operations** - Consistent updates via stored procedures

## 🚀 Deployment

### Vercel Deployment

1. **Connect GitHub** repository to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - automatic builds on push to main

### MiniApp Registration

The app automatically generates a signed manifest for Farcaster MiniApp registration:

```typescript
// Manifest available at /.well-known/farcaster.json
{
  "accountAssociation": { /* signed with your wallet */ },
  "frame": {
    "version": "1",
    "name": "111words",
    "iconUrl": "https://your-domain.vercel.app/icon.png",
    "homeUrl": "https://your-domain.vercel.app"
  }
}
```

## 🎨 Design Philosophy

### Neobrutalist UI
- **Bold borders** and **high contrast**
- **Playful shadows** and **button interactions**
- **Bright color palette** with **clear hierarchy**
- **Accessible design** with **excellent readability**

### User Experience
- **Minimal friction** - Write and mint in seconds
- **Clear feedback** - Always know what's happening
- **Progressive enhancement** - Works with or without wallet
- **Mobile-first** - Optimized for Farcaster mobile

## 🛣️ Roadmap

### Phase 1: Core Experience ✅
- [x] Writing interface and coin minting
- [x] Farcaster authentication
- [x] Basic user dashboard
- [x] Share pages with market data

### Phase 2: Community Features 🚧
- [ ] Enhanced stats panel with clickable coins
- [ ] Community discovery feed
- [ ] Search and filtering
- [ ] User profiles and following

### Phase 3: Advanced Features 📋
- [ ] Writing prompts and challenges
- [ ] Collaborative writing
- [ ] NFT artwork generation
- [ ] Advanced trading features
- [ ] Analytics dashboard

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow existing naming conventions
- Add JSDoc comments for public functions
- Keep components small and focused

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zora** for the incredible Coins v4 SDK
- **Farcaster** for the MiniApp framework
- **Base** for fast and affordable transactions
- **Supabase** for the excellent developer experience
- **Vercel** for seamless deployment

## 📞 Support

- **Documentation**: Check the `/documentation` folder
- **Issues**: Create a GitHub issue
- **Community**: Join our Farcaster channel
- **Email**: support@111words.app

---

**Built with ❤️ for the Zora Coinathon 2025**

*Transform your words into value. Start writing today.*

