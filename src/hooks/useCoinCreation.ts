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

    // Try real coin creation if wallet clients are available
    if (walletClient && publicClient && isConnected) {
      console.log("✅ Using real Zora Coins SDK for coin creation");
      try {
        return await createWritingCoin(params, walletClient as WalletClient, publicClient as PublicClient);
      } catch (error) {
        console.warn("Real coin creation failed, falling back to mock:", error);
        // Fall back to mock if real creation fails
        return await createWritingCoinFallback(params);
      }
    } else {
      // Use fallback for now - this keeps the UX smooth
      console.log("⏳ Wallet clients not ready, using fallback (this is normal in MiniApps)");
      return await createWritingCoinFallback(params);
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