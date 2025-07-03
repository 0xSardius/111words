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

    // Wait a moment for wallet clients to be ready if connected but clients not available
    if (isConnected && (!walletClient || !publicClient)) {
      console.log("Wallet connected but clients not ready, waiting...");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // If we have wallet and public clients, use real SDK
    if (walletClient && publicClient && isConnected) {
      console.log("Using real Zora Coins SDK for coin creation");
      return await createWritingCoin(params, walletClient as WalletClient, publicClient as PublicClient);
    } else {
      console.log("Using fallback coin creation (no wallet clients available)");
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