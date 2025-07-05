import { useCallback } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { createWritingCoin, CoinParams, CoinCreationResult } from '../lib/coins';
import type { WalletClient, PublicClient } from 'viem';

export function useCoinCreation() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const createCoin = useCallback(async (
    content: string,
    wordCount: number,
    streakDay: number,
    userFid: number,
    username: string,
    totalCoins: number
  ): Promise<CoinCreationResult> => {
    if (!address) {
      console.log("❌ No wallet address available");
      return {
        success: false,
        error: "No wallet address available"
      };
    }

    const params: CoinParams = {
      content,
      wordCount,
      streakDay,
      userFid,
      userAddress: address,
      username,
      totalCoins,
    };

    console.log("🔍 Wallet state check:", {
      isConnected,
      hasWalletClient: !!walletClient,
      hasPublicClient: !!publicClient,
      address: address?.slice(0, 8) + "...",
    });

    // Wait for wallet clients to be ready (common in Farcaster MiniApps)
    if (isConnected && (!walletClient || !publicClient)) {
      console.log("⏳ Connected but clients not ready, waiting...");
      
      // Wait up to 5 seconds for clients to become available
      let attempts = 0;
      const maxAttempts = 25; // 5 seconds with 200ms intervals
      
      while (attempts < maxAttempts && (!walletClient || !publicClient)) {
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
        
        // Log progress every second
        if (attempts % 5 === 0) {
          console.log(`⏳ Still waiting for clients... (${attempts * 200}ms)`);
        }
      }
    }

    // Try real coin creation if wallet clients are available
    if (walletClient && publicClient && isConnected) {
      console.log("✅ Using real Zora Coins SDK for coin creation");
      return await createWritingCoin(params, walletClient as WalletClient, publicClient as PublicClient);
    } else {
      // PRODUCTION MODE: Fail instead of creating mock coins
      console.log("❌ Wallet clients not ready - failing instead of creating mock coins");
      return {
        success: false,
        error: "Wallet not ready. Please try reloading the page or check your wallet connection."
      };
    }
  }, [address, walletClient, publicClient, isConnected]);

  return {
    createCoin,
    isConnected,
    address,
    canCreateCoin: !!address, // Can always create coins (with fallback if needed)
    hasRealWallet: isConnected && !!walletClient && !!publicClient
  };
} 