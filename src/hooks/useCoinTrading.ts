"use client"

import { useState } from "react"
import { useAccount, useWalletClient, usePublicClient } from "wagmi"
import { parseEther, type Address } from "viem"

// Import tradeCoin from Zora SDK
import { tradeCoin, TradeParameters } from "@zoralabs/coins-sdk"

interface TradeParams {
  coinAddress: string
  amountInEth: string
  slippage?: number
}

export function useCoinTrading() {
  const [isTrading, setIsTrading] = useState(false)
  const [tradeError, setTradeError] = useState<string | null>(null)
  
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const buyCoins = async ({ coinAddress, amountInEth, slippage = 0.05 }: TradeParams) => {
    if (!address) {
      throw new Error("No wallet address available")
    }

    // Wait for wallet clients to be ready (common in Farcaster MiniApps)
    if (!walletClient || !publicClient) {
      console.log("⏳ Waiting for wallet clients to be ready for trading...");
      
      // Wait up to 3 seconds for clients to become available
      let attempts = 0;
      const maxAttempts = 15; // 3 seconds with 200ms intervals
      
      while (attempts < maxAttempts && (!walletClient || !publicClient)) {
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
      }

      if (!walletClient || !publicClient) {
        throw new Error("Trading not available - wallet clients not ready")
      }
    }

    setIsTrading(true)
    setTradeError(null)

    try {
      console.log("🔄 Trading ETH for coins:", { coinAddress, amountInEth, slippage })
      
      // Real implementation with Zora SDK
      const tradeParameters: TradeParameters = {
        sell: { type: "eth" },
        buy: { type: "erc20", address: coinAddress as Address },
        amountIn: parseEther(amountInEth),
        slippage,
        sender: address,
      }

      const receipt = await tradeCoin({
        tradeParameters,
        walletClient,
        account: { address, type: "json-rpc" },
        publicClient,
      })

      console.log("✅ Trade successful:", receipt)

      return {
        success: true,
        txHash: receipt.transactionHash,
        amountReceived: "Trade completed successfully"
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Trading failed"
      setTradeError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsTrading(false)
    }
  }

  const sellCoins = async ({ coinAddress, amountInEth, slippage = 0.15 }: TradeParams) => {
    if (!address) {
      throw new Error("No wallet address available")
    }

    // Wait for wallet clients to be ready (common in Farcaster MiniApps)
    if (!walletClient || !publicClient) {
      console.log("⏳ Waiting for wallet clients to be ready for trading...");
      
      // Wait up to 3 seconds for clients to become available
      let attempts = 0;
      const maxAttempts = 15; // 3 seconds with 200ms intervals
      
      while (attempts < maxAttempts && (!walletClient || !publicClient)) {
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
      }

      if (!walletClient || !publicClient) {
        throw new Error("Trading not available - wallet clients not ready")
      }
    }

    setIsTrading(true)
    setTradeError(null)

    try {
      console.log("🔄 Trading coins for ETH:", { coinAddress, amountInEth, slippage })
      
      // Real implementation with Zora SDK
      const tradeParameters: TradeParameters = {
        sell: { type: "erc20", address: coinAddress as Address },
        buy: { type: "eth" },
        amountIn: parseEther(amountInEth), // Amount of coins to sell
        slippage,
        sender: address,
      }

      const receipt = await tradeCoin({
        tradeParameters,
        walletClient,
        account: { address, type: "json-rpc" },
        publicClient,
      })

      console.log("✅ Sell trade successful:", receipt)

      return {
        success: true,
        txHash: receipt.transactionHash,
        amountReceived: "Trade completed successfully"
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Trading failed"
      setTradeError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsTrading(false)
    }
  }

  return {
    buyCoins,
    sellCoins,
    isTrading,
    tradeError,
    canTrade: !!address // Can attempt trade if we have an address, clients will be waited for
  }
} 