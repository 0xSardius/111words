import { useCallback } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { createWritingCoin, createWritingCoinFallback, CoinParams, CoinCreationResult } from '../lib/coins';
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

    console.log("🔍 Coin creation debug:", {
      isConnected,
      hasWalletClient: !!walletClient,
      hasPublicClient: !!publicClient,
      address: address?.slice(0, 8) + "...",
    });

    // Wait a moment for wallet clients to be ready if connected but clients not available
    if (isConnected && (!walletClient || !publicClient)) {
      console.log("⏳ Wallet connected but clients not ready, waiting 2 seconds...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("🔍 After waiting - clients status:", {
        hasWalletClient: !!walletClient,
        hasPublicClient: !!publicClient,
      });
    }

    // If we have wallet and public clients, use real SDK
    if (walletClient && publicClient && isConnected) {
      console.log("✅ Using real Zora Coins SDK for coin creation");
      return await createWritingCoin(params, walletClient as WalletClient, publicClient as PublicClient);
    } else {
      console.log("⚠️ Using fallback coin creation - Missing:", {
        walletClient: !walletClient,
        publicClient: !publicClient,
        isConnected: !isConnected
      });
      return await createWritingCoinFallback(params);
    }
  }, [address, walletClient, publicClient, isConnected]);

  return {
    createCoin,
    isConnected,
    address,
    canCreateCoin: isConnected && !!walletClient && !!publicClient
  };
} 