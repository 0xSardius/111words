import { createConfig, http, WagmiProvider } from "wagmi";
import { base, degen, mainnet, optimism, unichain, celo } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { coinbaseWallet, metaMask } from 'wagmi/connectors';
import { APP_NAME, APP_ICON_URL, APP_URL } from "~/lib/constants";
import { useEffect } from "react";
import { useConnect, useAccount } from "wagmi";
import React from "react";

// Check if we're in a MiniApp context
function isInMiniApp(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for MiniApp specific properties
  const isMiniApp = (
    // Check for Farcaster MiniApp user agent
    navigator.userAgent.includes('Farcaster') ||
    // Check for MiniApp specific window properties
    typeof (window as Window & { farcasterMiniApp?: unknown }).farcasterMiniApp !== 'undefined' ||
    // Check for parent frame context
    window.parent !== window ||
    // Check for specific URL patterns
    window.location.hostname.includes('miniapps.farcaster.xyz') ||
    window.location.hostname.includes('farcaster.xyz')
  );
  
  console.log("🔍 MiniApp detection:", {
    userAgent: navigator.userAgent,
    hasFrameContext: window.parent !== window,
    hostname: window.location.hostname,
    isMiniApp
  });
  
  return isMiniApp;
}

// Create connectors based on environment
const createConnectors = () => {
  const connectors = [
    // Always add MiniApp connector (it will auto-detect compatibility)
    farcasterMiniApp(),
    // Add other connectors as fallbacks
    coinbaseWallet({
      appName: APP_NAME,
      appLogoUrl: APP_ICON_URL,
    }),
    metaMask({
      dappMetadata: {
        name: APP_NAME,
        url: APP_URL,
        iconUrl: APP_ICON_URL,
      },
    })
  ];
  
  console.log("🔧 Created connectors:", connectors.length, "connectors");
  return connectors;
};

// Create Wagmi config
const config = createConfig({
  chains: [base, mainnet, optimism, degen, unichain, celo],
  connectors: createConnectors(),
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [degen.id]: http(),
    [unichain.id]: http(),
    [celo.id]: http(),
  },
  ssr: true,
});

// Custom hook for MiniApp auto-connection
function useMiniAppAutoConnect() {
  const { connect, connectors, isSuccess, isError, error } = useConnect();
  const { isConnected, address } = useAccount();

  useEffect(() => {
    console.log("🔍 Auto-connect check:", {
      isConnected,
      hasWindow: typeof window !== 'undefined',
      connectorsCount: connectors.length,
      connectorIds: connectors.map(c => c.id),
      isSuccess,
      isError,
      error: error?.message,
      isInMiniApp: isInMiniApp()
    });

    // Auto-connect to MiniApp connector if in MiniApp context and not already connected
    if (!isConnected && typeof window !== 'undefined' && connectors.length > 0) {
      const miniAppConnector = connectors.find(c => c.id === 'farcasterMiniApp');
      console.log("🔗 MiniApp connector found:", !!miniAppConnector, miniAppConnector?.name);
      
      if (miniAppConnector && isInMiniApp()) {
        console.log("🎯 Auto-connecting to Farcaster MiniApp connector");
        try {
          connect({ connector: miniAppConnector });
          console.log("✅ Auto-connection initiated");
        } catch (err) {
          console.error("❌ Auto-connection failed:", err);
        }
      } else {
        console.log("⚠️ No MiniApp connector available or not in MiniApp context, available connectors:", 
          connectors.map(c => ({ id: c.id, name: c.name, type: c.type }))
        );
      }
    } else if (isConnected && address) {
      console.log("✅ Already connected:", address.slice(0, 6) + "..." + address.slice(-4));
    }
  }, [isConnected, connect, connectors, isSuccess, isError, error, address]);

  return null;
}

// Component to handle auto-connection
function AutoConnectHandler() {
  useMiniAppAutoConnect();
  return null;
}

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

export function AppWagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AutoConnectHandler />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
