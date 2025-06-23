# 🚀 Zora Coinathon Build Checklist

## 📋 **Current Status Assessment**

### ✅ **Completed:**
- MVP concept and planning documentation
- UI components (writing interface, success screens, stats panel)
- Farcaster Frame integration setup
- Basic project structure with Next.js 14
- Authentication with Farcaster
- Wagmi provider configuration
- Mock coin creation flow
- **Database schema design** (see `111words-sql-query.md`)

### ❌ **Missing Critical Components:**
- **Coins v4 SDK integration** (the core requirement!)
- **Supabase database setup**
- **Real coin minting functionality**
- **Frame routing and state management**
- **Production deployment**

---

## 🚀 **Phase 1: Core Coinathon Requirements (Priority 1)**

### **1.1 Coins v4 SDK Integration** 🔥
- [x] Install `@zoralabs/coins-sdk` dependency
- [x] Create coin minting service (`src/lib/coins.ts`)
- [ ] Implement `createCoin` function with proper metadata
- [ ] Add Base network configuration
- [ ] Create coin metadata upload function
- [ ] Test coin creation on Base testnet

### **1.2 Supabase Database Setup** 🗄️
- [ ] Create Supabase project
- [ ] Install `@supabase/supabase-js`
- [ ] Execute database schema from `111words-sql-query.md`:
  - Users table with FID, streaks, stats
  - Writings table with coin data
  - Daily stats view
  - Row Level Security
  - Performance indexes
  - `create_writing_and_update_user()` function
- [ ] Create Supabase client configuration (`src/lib/supabase.ts`)
- [ ] Add environment variables for Supabase
- [ ] Test database connections and functions
- [ ] Set up RLS policies for security

### **1.3 Frame Routing & State Management** 🖼️
- [ ] Create `/api/frame` route for frame interactions
- [ ] Implement frame state machine (start → write → mint → success)
- [ ] Add frame validation and error handling
- [ ] Create frame-specific UI components
- [ ] Test frame flow in Warpcast

### **1.4 Real Coin Minting Flow** 🪙
- [ ] Replace mock coin creation with real Coins v4 calls
- [ ] Add wallet connection in frames
- [ ] Implement transaction signing
- [ ] Add coin metadata generation
- [ ] Create coin success screen with real data
- [ ] Add error handling for failed transactions

---

## 🎯 **Phase 2: Polish & Production Ready (Priority 2)**

### **2.1 Data Persistence** 💾
- [ ] Connect writing interface to Supabase using existing schema
- [ ] Implement user streak tracking using `create_writing_and_update_user()` function
- [ ] Add daily prompt rotation
- [ ] Create user stats aggregation using daily_stats view
- [ ] Add coin trading volume tracking
- [ ] Implement 111-word legend detection

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
- [ ] Add comprehensive error handling
- [ ] Implement retry mechanisms
- [ ] Add loading states
- [ ] Create user-friendly error messages
- [ ] Add transaction status tracking

---

## 🚀 **Phase 3: Deployment & Testing (Priority 3)**

### **3.1 Production Deployment** 🌐
- [ ] Deploy to Vercel
- [ ] Configure custom domain
- [ ] Set up environment variables
- [ ] Configure Farcaster Frame metadata
- [ ] Test production deployment

### **3.2 Testing & Validation** ✅
- [ ] Test coin creation on Base mainnet
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

1. **Coins v4 SDK Integration** - This is the core requirement
2. **Supabase Database** - Needed for data persistence (schema ready in `111words-sql-query.md`)
3. **Frame Routing** - Required for miniapp functionality
4. **Real Coin Minting** - The main feature
5. **Production Deployment** - Must be live for judging

---

## 📅 **Recommended Timeline**

**Day 1-2: Core Integration**
- Coins v4 SDK setup
- Supabase database creation (using existing schema)
- Basic frame routing

**Day 3-4: Functionality**
- Real coin minting
- Data persistence
- Frame optimization

**Day 5: Polish & Deploy**
- Error handling
- Production deployment
- Testing & validation

---

## 🎯 **Success Metrics for Coinathon**

- ✅ **Coin Creation**: Users can mint real ERC-20 coins
- ✅ **Frame Functionality**: Works seamlessly in Warpcast
- ✅ **Data Persistence**: User data and streaks are saved
- ✅ **Social Sharing**: Users can share their coins
- ✅ **Production Ready**: Live and accessible

---

## 📝 **Progress Notes**

*Use this section to track progress, blockers, and decisions made during development:*

### **Current Focus:**
✅ **Database Schema**: Fixed SQL syntax error in `create_writing_and_update_user()` function
✅ **Coins v4 SDK**: Installed `@zoralabs/coins-sdk` dependency
✅ **Coin Service**: Created `src/lib/coins.ts` with coin creation functionality
✅ **UI Integration**: Updated miniapp to use new coin service
🔄 **Next**: Setting up Supabase database and testing coin creation flow

### **Blockers:**
None currently - ready to proceed with database setup

### **Decisions Made:**
- Using existing comprehensive database schema from `111words-sql-query.md`
- Fixed SQL function delimiter syntax ($$ instead of $)
- Following Zora Coins SDK documentation for integration
- Created coin service with simulation for development, ready for real SDK integration
- Integrated coin service with existing UI components

### **Next Steps:**
1. **Set up Supabase database** using existing schema
2. **Test coin creation flow** with current simulation
3. **Get Zora API key** for production deployment
4. **Implement real SDK integration** once API key is available
5. **Add wallet connection** for real coin minting

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