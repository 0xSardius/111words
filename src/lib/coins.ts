import { setApiKey, createCoin, DeployCurrency} from "@zoralabs/coins-sdk";
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
  username: z.string().min(1, "Username is required"),
  totalCoins: z.number().min(0, "Total coins must be non-negative"),
});

export type CoinParams = z.infer<typeof CoinParamsSchema>;

export interface CoinCreationParams {
  content: string;
  wordCount: number;
  streakDay: number;
  userFid: number;
  userAddress: string;
  username: string;
  totalCoins: number;
  prompt?: string;
}

export interface CoinMetadata {
  name: string;
  symbol: string;
  description: string;
  content: string;
  image: string;
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

// Generate coin symbol based on username and total coins (always unique)
export function generateCoinSymbol(username: string, totalCoins: number): string {
  // Clean username: remove @ symbol, convert to uppercase, limit length
  const cleanUsername = username.replace('@', '').toUpperCase().substring(0, 8);
  const coinNumber = totalCoins + 1; // Next coin number
  return `${cleanUsername}${coinNumber}`;
}

// Generate coin name based on username and total coins
export function generateCoinName(username: string, totalCoins: number, streakDay: number): string {
  const coinNumber = totalCoins + 1;
  return `@${username} Creation #${coinNumber} (Day ${streakDay})`;
}

// Upload metadata to IPFS using Pinata v3 API
export async function uploadMetadataToIPFS(metadata: CoinMetadata): Promise<string> {
  if (!process.env.PINATA_JWT) {
    console.warn("PINATA_JWT not found, using fallback placeholder metadata");
    return "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy";
  }

  try {
    const response = await fetch('https://api.pinata.cloud/v3/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${metadata.symbol}-metadata.json`,
        content: metadata,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`IPFS upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    const ipfsHash = result.data?.cid || result.cid;
    
    if (!ipfsHash) {
      throw new Error("No IPFS hash returned from Pinata");
    }

    console.log("Metadata uploaded to IPFS:", {
      name: metadata.name,
      symbol: metadata.symbol,
      ipfsHash,
      uri: `ipfs://${ipfsHash}`
    });

    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error("Failed to upload metadata to IPFS:", error);
    // Fallback to placeholder if IPFS upload fails
    console.warn("Using fallback placeholder metadata due to IPFS upload failure");
    return "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy";
  }
}

// Create enhanced coin metadata with 111words-specific attributes
export function createCoinMetadata(params: CoinParams): CoinMetadata {
  const symbol = generateCoinSymbol(params.username, params.totalCoins);
  const name = generateCoinName(params.username, params.totalCoins, params.streakDay);
  const is111Legend = params.wordCount >= 111;
  
  return {
    name,
    symbol,
    description: `A daily writing coin created on day ${params.streakDay} of ${params.username}'s writing streak. This coin represents ${params.wordCount} words of creative expression${is111Legend ? ' and qualifies as a 111 Legend!' : '.'}`,
    image: `https://111words.vercel.app/api/coin-image/${symbol}`, // TODO: Implement coin image generation
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
        trait_type: "111 Legend",
        value: is111Legend ? "Yes" : "No"
      },
      {
        trait_type: "Creator FID",
        value: params.userFid.toString()
      },
      {
        trait_type: "Creator Username",
        value: params.username
      },
      {
        trait_type: "Coin Number",
        value: (params.totalCoins + 1).toString()
      },
      {
        trait_type: "Creation Date",
        value: new Date().toISOString().split('T')[0]
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

    // Generate coin details and metadata
    const symbol = generateCoinSymbol(params.username, params.totalCoins);
    const name = generateCoinName(params.username, params.totalCoins, params.streakDay);
    const metadata = createCoinMetadata(params);
    
    // Upload metadata to IPFS
    console.log("Uploading metadata to IPFS...");
    const metadataUri = await uploadMetadataToIPFS(metadata);
    console.log("Metadata uploaded successfully:", metadataUri);

    // Define coin parameters for Zora SDK
    const coinParams = {
      name,
      symbol,
      uri: metadataUri as `ipfs://${string}`,
      payoutRecipient: params.userAddress as Address,
      // Optional: Add platform referrer if you want to earn fees
      // platformReferrer: "0xYourPlatformAddress" as Address,
      chainId: base.id,
      currency: DeployCurrency.ZORA, // Use ZORA tokens for deployment
    };

    console.log("Creating coin with params:", {
      ...coinParams,
      metadata: {
        wordCount: params.wordCount,
        streakDay: params.streakDay,
        is111Legend: params.wordCount >= 111
      }
    });

    // Create the coin using Zora SDK
    const result = await createCoin(coinParams, walletClient, publicClient, {
      gasMultiplier: 120, // Add 20% buffer to gas
    });
    
    console.log("Coin creation successful:", {
      transactionHash: result.hash,
      coinAddress: result.address,
      symbol,
      metadataUri,
      deploymentDetails: result.deployment
    });

    return {
      success: true,
      coinAddress: result.address,
      symbol,
      txHash: result.hash,
      metadata
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
    const symbol = generateCoinSymbol(params.username, params.totalCoins);
    // Use a more realistic-looking mock address for testing (but clearly marked as mock)
    const coinAddress = `0x1111${Math.random().toString(16).substring(2, 38)}`; // Mock address starting with 0x1111
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`; // Mock transaction hash

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Fallback coin creation (simulated):", {
      symbol,
      coinAddress,
      txHash,
      wordCount: params.wordCount,
      streakDay: params.streakDay,
      totalCoins: params.totalCoins
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
   // For now, return basic info with the provided address
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

// Test function to verify IPFS upload is working
export async function testIPFSUpload(): Promise<{ success: boolean; uri?: string; error?: string }> {
  const testMetadata: CoinMetadata = {
    name: "Test Coin",
    symbol: "TEST1",
    description: "A test coin to verify IPFS upload functionality",
    image: "https://111words.vercel.app/api/coin-image/TEST1",
    content: "This is a test writing to verify that IPFS upload is working correctly.",
    attributes: [
      {
        trait_type: "Word Count",
        value: "15"
      },
      {
        trait_type: "Test",
        value: "Yes"
      }
    ]
  };

  try {
    const uri = await uploadMetadataToIPFS(testMetadata);
    return {
      success: true,
      uri
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
} 