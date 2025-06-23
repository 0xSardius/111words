"use client"

import { signIn, useSession, signOut } from "next-auth/react"
import { useState } from "react"

export function SignInButton() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("credentials", { callbackUrl: "/" })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 text-center">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold mt-2">Loading...</p>
      </div>
    )
  }

  if (session?.user?.fid) {
    return (
      <div className="bg-green-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3">
        <div className="text-center">
          <p className="text-sm font-bold">✅ Connected</p>
          <p className="text-xs">FID: {session.user.fid}</p>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="mt-2 px-3 py-1 bg-red-400 text-white text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3">
      <div className="text-center">
        <p className="text-sm font-bold mb-2">🔗 Connect Wallet</p>
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="px-4 py-2 bg-white text-black text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Connecting..." : "Sign in with Farcaster"}
        </button>
      </div>
    </div>
  )
} 