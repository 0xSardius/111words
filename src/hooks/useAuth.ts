"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { sdk } from "@farcaster/frame-sdk"
import { useMiniApp } from "@neynar/react"

interface AuthUser {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
  authMethod: 'quick-auth' | 'next-auth' | 'none'
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    authMethod: 'none'
  })

  const { data: session, status: nextAuthStatus } = useSession()
  const miniAppContext = useMiniApp()

  useEffect(() => {
    const authenticate = async () => {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        // Try Quick Auth first (preferred for MiniApps)
        if (miniAppContext) {
          console.log("Attempting Quick Auth...")
          
          try {
            // Use Quick Auth to get user info
            const response = await sdk.quickAuth.fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/me`)
            
            if (response.ok) {
              const userData = await response.json()
              console.log("Quick Auth successful:", userData)
              
              setAuthState({
                user: {
                  fid: userData.fid,
                  username: userData.username,
                  displayName: userData.displayName,
                  pfpUrl: userData.pfpUrl
                },
                isLoading: false,
                error: null,
                authMethod: 'quick-auth'
              })
              return
            } else {
              console.log("Quick Auth failed, falling back to NextAuth")
            }
          } catch (quickAuthError) {
            console.log("Quick Auth error, falling back to NextAuth:", quickAuthError)
          }
        }

        // Fallback to NextAuth
        if (nextAuthStatus === 'authenticated' && session?.user?.fid) {
          console.log("Using NextAuth session")
          setAuthState({
            user: {
              fid: session.user.fid,
              username: "user", // Default values for NextAuth
              displayName: "User",
              pfpUrl: "/placeholder.svg"
            },
            isLoading: false,
            error: null,
            authMethod: 'next-auth'
          })
          return
        }

        // No authentication available
        if (nextAuthStatus === 'unauthenticated') {
          console.log("No authentication available")
          setAuthState({
            user: null,
            isLoading: false,
            error: null,
            authMethod: 'none'
          })
          return
        }

        // Still loading
        if (nextAuthStatus === 'loading') {
          setAuthState(prev => ({ ...prev, isLoading: true }))
          return
        }

      } catch (error) {
        console.error("Auth error:", error)
        setAuthState({
          user: null,
          isLoading: false,
          error: error instanceof Error ? error.message : "Authentication failed",
          authMethod: 'none'
        })
      }
    }

    authenticate()
  }, [miniAppContext, session, nextAuthStatus])

  // Helper function to get FID safely
  const getFid = (): number | null => {
    return authState.user?.fid || null
  }

  // Helper function to check if user is authenticated
  const isAuthenticated = (): boolean => {
    return !!authState.user?.fid
  }

  return {
    ...authState,
    getFid,
    isAuthenticated
  }
} 