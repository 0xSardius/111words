import { setApiKey, createCoin, DeployCurrency } from "@zoralabs/coins-sdk";
import { z } from "zod";
import { Address, type WalletClient, type PublicClient } from "viem";
import { base } from "viem/chains";

// Initialize API key
if (process.env.ZORA_API_KEY) {
  setApiKey(process.env.ZORA_API_KEY);
}

// Coin creation parameters validation schema
const CoinParamsSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  wordCount: z.number().min(1, "Word count must be at least 1"),
  streakDay: z.number().min(1, "Streak day must be at least 1"),
  userFid: z.number().min(1, "User FID must be valid"),
  userAddress: z.string().min(1, "User address is required"),
});

export type CoinParams = z.infer<typeof CoinParamsSchema>;

export interface CoinCreationParams {
  content: string;
  wordCount: number;
  streakDay: number;
  userFid: number;
  userAddress: string;
  prompt?: string;
}

export interface CoinMetadata {
  name: string;
  description: string;
  content: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface CoinCreationResult {
  success: boolean;
  coinAddress?: string;
  txHash?: string;
  symbol?: string;
  metadata?: CoinMetadata;
  error?: string;
}

// Validate coin creation parameters
export function validateCoinParams(params: CoinParams): boolean {
  try {
    CoinParamsSchema.parse(params);
    return true;
  } catch (error) {
    console.error("Coin params validation failed:", error);
    return false;
  }
}

// Generate coin symbol based on user and day
export function generateCoinSymbol(userFid: number, streakDay: number): string {
  // Create a unique symbol: USER + DAY (e.g., "12345D1", "12345D2")
  return `${userFid}D${streakDay}`;
}

// Generate coin name based on user and day
export function generateCoinName(userFid: number, streakDay: number): string {
  return `Day ${streakDay} Creation by User ${userFid}`;
}

// Create coin metadata for Zora Coins v4
export function createCoinMetadata(params: CoinParams) {
  const symbol = generateCoinSymbol(params.userFid, params.streakDay);
  const name = generateCoinName(params.userFid, params.streakDay);
  
  return {
    name,
    symbol,
    description: `A daily writing coin created on day ${params.streakDay} of the user's writing streak. This coin represents ${params.wordCount} words of creative expression.`,
    image: "https://placeholder.com/coin-image.png", // TODO: Generate actual image
    content: params.content,
    attributes: [
      {
        trait_type: "Word Count",
        value: params.wordCount.toString()
      },
      {
        trait_type: "Streak Day",
        value: params.streakDay.toString()
      },
      {
        trait_type: "Creator FID",
        value: params.userFid.toString()
      },
      {
        trait_type: "Content Preview",
        value: params.content.substring(0, 100) + (params.content.length > 100 ? "..." : "")
      }
    ]
  };
}

// Real coin creation function using Zora Coins SDK
export async function createWritingCoin(
  params: CoinParams,
  walletClient: WalletClient,
  publicClient: PublicClient
): Promise<CoinCreationResult> {
  try {
    // Validate parameters
    if (!validateCoinParams(params)) {
      return {
        success: false,
        error: "Invalid coin creation parameters"
      };
    }

    // Generate coin details
    const symbol = generateCoinSymbol(params.userFid, params.streakDay);
    const name = generateCoinName(params.userFid, params.streakDay);
    
    // Create metadata URI (for now, we'll use a placeholder)
    // In production, you'd upload metadata to IPFS
    const metadataUri = "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy" as const;

    // Define coin parameters for Zora SDK
    const coinParams = {
      name,
      symbol,
      uri: metadataUri,
      payoutRecipient: params.userAddress as Address,
      // Optional: Add platform referrer if you want to earn fees
      // platformReferrer: "0xYourPlatformAddress" as Address,
      chainId: base.id,
      currency: DeployCurrency.ZORA, // Use ZORA tokens for deployment
    };

    console.log("Creating coin with params:", coinParams);

    // Create the coin using Zora SDK
    const result = await createCoin(coinParams, walletClient, publicClient, {
      gasMultiplier: 120, // Add 20% buffer to gas
    });
    
    console.log("Coin creation successful:", {
      transactionHash: result.hash,
      coinAddress: result.address,
      deploymentDetails: result.deployment
    });

    return {
      success: true,
      coinAddress: result.address,
      symbol,
      txHash: result.hash,
      metadata: createCoinMetadata(params)
    };

  } catch (error) {
    console.error("Coin creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

// Fallback function for when wallet clients aren't available
export async function createWritingCoinFallback(params: CoinParams): Promise<CoinCreationResult> {
  try {
    // Validate parameters
    if (!validateCoinParams(params)) {
      return {
        success: false,
        error: "Invalid coin creation parameters"
      };
    }

    // Generate coin details
    const symbol = generateCoinSymbol(params.userFid, params.streakDay);
    const coinAddress = `0x${Math.random().toString(16).substring(2, 42)}`; // Mock address
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`; // Mock transaction hash

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Fallback coin creation (simulated):", {
      symbol,
      coinAddress,
      txHash,
      wordCount: params.wordCount,
      streakDay: params.streakDay
    });

    return {
      success: true,
      coinAddress,
      symbol,
      txHash
    };
  } catch (error) {
    console.error("Fallback coin creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

// Get coin trading data (placeholder for future integration)
export async function getCoinTradingData() {
  // TODO: Integrate with actual trading data API
  return {
    price: Math.random() * 100,
    volume: Math.random() * 1000,
    holders: Math.floor(Math.random() * 100),
    marketCap: Math.random() * 10000
  };
}

// Get coin information
export async function getCoinInfo(coinAddress: string) {
  try {
    // This would use the SDK's query functions
    // For now, return basic info
    return {
      address: coinAddress,
      symbol: "DAY",
      name: "Daily Creation",
    };
  } catch (error) {
    console.error("Failed to get coin info:", error);
    return null;
  }
} 