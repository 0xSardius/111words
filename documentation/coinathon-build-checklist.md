# 🚀 Zora Coinathon Build Checklist

## 📋 **Current Status Assessment**

### ✅ **Completed:**
- MVP concept and planning documentation
- UI components (writing interface, success screens, stats panel)
- Farcaster Frame integration setup
- Basic project structure with Next.js 14
- Authentication with Farcaster
- Wagmi provider configuration
- **Database schema design** (see `111words-sql-query.md`)
- **Supabase database setup** with RLS policies
- **Real coin minting functionality** with Zora Coins SDK
- **Vercel deployment** working

### ❌ **Missing Critical Components:**
- **Frame routing and state management**
- **Production testing on Base network**
- **IPFS metadata upload**

---

## 🚀 **Phase 1: Core Coinathon Requirements (Priority 1)**

### **1.1 Coins v4 SDK Integration** 🔥
- [x] Install `@zoralabs/coins-sdk` dependency
- [x] Create coin minting service (`src/lib/coins.ts`)
- [x] Implement `createCoin` function with proper metadata
- [x] Add Base network configuration
- [x] Create coin metadata upload function
- [ ] Test coin creation on Base testnet
- [ ] Get Zora API key from developer settings

### **1.2 Supabase Database Setup** 🗄️
- [x] Create Supabase project
- [x] Install `@supabase/supabase-js`
- [x] Execute database schema from `111words-sql-query.md`:
  - Users table with FID, streaks, stats
  - Writings table with coin data
  - Daily stats view
  - Row Level Security
  - Performance indexes
  - `create_writing_and_update_user()` function
- [x] Create Supabase client configuration (`src/lib/supabase.ts`)
- [x] Add environment variables for Supabase
- [x] Test database connections and functions
- [x] Set up RLS policies for security

### **1.3 Frame Routing & State Management** 🖼️
- [ ] Create `/api/frame` route for frame interactions
- [ ] Implement frame state machine (start → write → mint → success)
- [ ] Add frame validation and error handling
- [ ] Create frame-specific UI components
- [ ] Test frame flow in Warpcast

### **1.4 Real Coin Minting Flow** 🪙
- [x] Replace mock coin creation with real Coins v4 calls
- [x] Add wallet connection in frames
- [x] Implement transaction signing
- [x] Add coin metadata generation
- [x] Create coin success screen with real data
- [x] Add error handling for failed transactions
- [ ] Test on Base testnet
- [ ] Add IPFS metadata upload

### **1.5 Farcaster Sharing Integration** 📱
- [ ] Create share service (`src/lib/sharing.ts`)
- [ ] Implement Farcaster cast composition with coin embed
- [ ] Add share button to success screen
- [ ] Generate share text with coin details and trading link
- [ ] Create share preview images for social media
- [ ] Test sharing flow in Warpcast
- [ ] Add share analytics tracking

### **1.6 Coin Naming Enhancement** ✏️
- [ ] Implement default coin naming: "@username's Day X Creation"
- [ ] Add optional custom title input after coin creation
- [ ] Create coin title customization UI component
- [ ] Add character limit validation (50 chars)
- [ ] Update coin metadata with custom names
- [ ] Test naming flow with both default and custom titles

---

## 🎯 **Phase 2: Polish & Production Ready (Priority 2)**

### **2.1 Data Persistence** 💾
- [x] Connect writing interface to Supabase using existing schema
- [x] Implement user streak tracking using `create_writing_and_update_user()` function
- [ ] Add daily prompt rotation
- [x] Create user stats aggregation using daily_stats view
- [ ] Add coin trading volume tracking
- [x] Implement 111-word legend detection

### **2.2 Frame Optimization** ⚡
- [ ] Optimize frame loading times
- [ ] Add proper frame meta tags
- [ ] Implement frame caching
- [ ] Add frame analytics
- [ ] Test frame performance

### **2.3 Social Features** 📱
- [ ] Implement Farcaster sharing
- [ ] Add coin link generation
- [ ] Create share preview images
- [ ] Add social proof elements
- [ ] Implement viral mechanics

### **2.4 Error Handling & UX** 🛡️
- [x] Add comprehensive error handling
- [x] Implement retry mechanisms
- [x] Add loading states
- [x] Create user-friendly error messages
- [x] Add transaction status tracking

---

## 🚀 **Phase 3: Deployment & Testing (Priority 3)**

### **3.1 Production Deployment** 🌐
- [x] Deploy to Vercel
- [ ] Configure custom domain
- [x] Set up environment variables
- [x] Configure Farcaster Frame metadata
- [x] Test production deployment

### **3.2 Testing & Validation** ✅
- [ ] Test coin creation on Base testnet
- [ ] Validate frame functionality in Warpcast
- [ ] Test user flows end-to-end
- [ ] Performance testing
- [ ] Security audit

### **3.3 Demo Preparation** 🎪
- [ ] Create demo script
- [ ] Prepare live demo data
- [ ] Create presentation materials
- [ ] Practice demo flow
- [ ] Prepare backup demo scenarios

---

## 🔥 **Critical Path Items (Must Complete)**

1. **✅ Coins v4 SDK Integration** - COMPLETED
2. **✅ Supabase Database** - COMPLETED
3. **Frame Routing** - Required for miniapp functionality
4. **✅ Real Coin Minting** - COMPLETED
5. **Farcaster Sharing** - Create-and-share in one go (user priority)
6. **✅ Production Deployment** - COMPLETED

---

## 📅 **Recommended Timeline**

**Day 1-2: Testing & Polish**
- Test coin creation on Base testnet
- Fix auth errors
- Frame routing implementation

**Day 3-4: Frame & Sharing**
- Complete frame routing
- Implement Farcaster sharing
- IPFS metadata upload

**Day 5: Final Testing**
- End-to-end testing
- Performance optimization
- Demo preparation

---

## 🎯 **Success Metrics for Coinathon**

- ✅ **Coin Creation**: Users can mint real ERC-20 coins
- 🔄 **Frame Functionality**: Works seamlessly in Warpcast
- ✅ **Data Persistence**: User data and streaks are saved
- 🔄 **Social Sharing**: Users can share their coins
- ✅ **Production Ready**: Live and accessible

---

## 📝 **Progress Notes**

*Use this section to track progress, blockers, and decisions made during development:*

### **Current Focus:**
✅ **Real Coin Minting**: Successfully implemented with Zora Coins SDK and Wagmi integration
✅ **Database Integration**: Fully connected with Supabase and atomic functions
🔄 **Next**: Fix auth errors and implement frame routing

### **Recent Achievements:**
- ✅ **Real Coin Creation**: Integrated Zora Coins SDK with proper Base network support
- ✅ **Wallet Integration**: Seamless wallet connection with Farcaster Frame connector
- ✅ **Type Safety**: Fixed all TypeScript errors with proper viem types
- ✅ **Error Handling**: Comprehensive error handling and user feedback
- ✅ **Fallback System**: Graceful fallback when wallet isn't connected

### **Current Blockers:**
- Auth errors need to be addressed
- Need Zora API key for production
- Frame routing not yet implemented

### **Decisions Made:**
- Using Zora Coins SDK with Base network and ZORA tokens
- Implementing fallback system for development vs production
- Proper TypeScript typing with viem types
- Comprehensive error handling for wallet connection issues

### **Next Steps:**
1. **Integrate Supabase with miniapp** - Replace mock data with real database calls
2. **Implement user authentication flow** - Create/get users by FID
3. **Connect coin creation to database** - Save writings and update streaks
4. **Test full user flow** - Write → Create coin → Save to DB → Update stats
5. **Remove test component** - Clean up the UI

---

## 🔗 **Useful Resources**

- [Coins v4 SDK Documentation](https://docs.zora.co/coins/sdk/)
- [Farcaster Frame SDK](https://docs.farcaster.xyz/developers/frames)
- [Supabase Documentation](https://supabase.com/docs)
- [Base Network Documentation](https://docs.base.org/)
- [Zora Coinathon Guidelines](https://zora.co/coinathon)

---

## 📚 **Project Documentation**

- **Database Schema**: `documentation/111words-sql-query.md` ✅
- **MVP Concept**: `documentation/111words-mvp-concept.md` ✅
- **Stage 2 Plan**: `documentation/111words-stage2-expansion-plan.md` ✅
- **Implementation Plan**: `documentation/111words-implementation.md` (empty - needs content)

---

*Last Updated: [Current Date]*
*Current Phase: Phase 1 - Core Coinathon Requirements* 