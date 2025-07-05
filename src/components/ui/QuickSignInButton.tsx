"use client"

import { useQuickAuth } from "../../hooks/useQuickAuth"
import { useConnect, useAccount } from "wagmi"
import { useState, useEffect } from "react"

export function QuickSignInButton() {
  const { 
    isAuthenticated, 
    user, 
    isLoading: authLoading, 
    authenticate, 
    logout, 
    isInMiniApp,
    error 
  } = useQuickAuth()
  
  const { connect, connectors } = useConnect()
  const { isConnected, address } = useAccount()
  const [isConnecting, setIsConnecting] = useState(false)

  // Auto-connect wallet when authenticated (only in MiniApp)
  useEffect(() => {
    if (isAuthenticated && isInMiniApp && !isConnected && !isConnecting) {
      const autoConnectWallet = async () => {
        setIsConnecting(true)
        try {
          // Try Farcaster MiniApp connector first
          const farcasterConnector = connectors.find(c => c.name.includes('Farcaster') || c.id === 'farcasterMiniApp')
          const targetConnector = farcasterConnector || connectors[0]
          
          if (targetConnector?.ready) {
            await connect({ connector: targetConnector })
            console.log('Wallet auto-connected successfully')
          }
        } catch (error) {
          console.log('Auto wallet connection failed (this is okay):', error)
        } finally {
          setIsConnecting(false)
        }
      }

      // Small delay to let auth settle
      const timer = setTimeout(autoConnectWallet, 500)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, isInMiniApp, isConnected, isConnecting, connect, connectors])

  const handleSignIn = async () => {
    if (isInMiniApp) {
      // In MiniApp, auth should be automatic - this button shouldn't be needed
      console.log('Already authenticated via MiniApp context')
      return
    }
    
    // Outside MiniApp, trigger traditional auth
    await authenticate()
  }

  const handleSignOut = async () => {
    await logout()
  }

  if (authLoading) {
    return (
      <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 text-center">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold mt-2">Loading auth...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3">
        <div className="text-center">
          <p className="text-sm font-bold">❌ Auth Error</p>
          <p className="text-xs text-red-700 mt-1">{error}</p>
          <button
            onClick={handleSignIn}
            className="mt-2 px-3 py-1 bg-blue-400 text-white text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (isAuthenticated && user) {
    const walletStatus = isConnecting ? 'Connecting...' : 
                        isConnected ? `💰 ${address?.slice(0, 6)}...${address?.slice(-4)}` :
                        '⚠️ Wallet not connected'
    
    const walletColor = isConnected ? 'text-green-700' : 'text-orange-600'

    return (
      <div className="bg-green-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3">
        <div className="text-center">
          <p className="text-sm font-bold">✅ Connected</p>
          <p className="text-xs">
            {isInMiniApp ? `@${user.username}` : `FID: ${user.fid}`}
          </p>
          <p className={`text-xs font-bold mt-1 ${walletColor}`}>
            {walletStatus}
          </p>
          {isInMiniApp && (
            <p className="text-xs text-blue-600 font-bold mt-1">
              🚀 MiniApp Mode
            </p>
          )}
          {!isInMiniApp && (
            <button
              onClick={handleSignOut}
              className="mt-2 px-3 py-1 bg-red-400 text-white text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    )
  }

  // Not authenticated - show sign in button (mainly for non-MiniApp environments)
  return (
    <div className="bg-blue-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3">
      <div className="text-center">
        <p className="text-sm font-bold mb-2">🔗 Connect Everything</p>
        <p className="text-xs text-gray-700 mb-3">
          {isInMiniApp ? 'Authenticating...' : 'Sign in + Connect wallet'}
        </p>
        {!isInMiniApp && (
          <button
            onClick={handleSignIn}
            className="px-4 py-2 bg-white text-black text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
          >
            Sign in with Farcaster
          </button>
        )}
      </div>
    </div>
  )
} 