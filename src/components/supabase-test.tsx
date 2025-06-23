"use client"

import { useState } from "react"
import { supabase, getUserByFid, createUser, getDailyStats } from "../lib/supabase"

export function SupabaseTest() {
  const [status, setStatus] = useState<string>("")
  const [result, setResult] = useState<any>(null)

  const testConnection = async () => {
    setStatus("Testing connection...")
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1)
      if (error) throw error
      setStatus("✅ Connection successful!")
      setResult({ connection: "OK", data })
    } catch (error) {
      setStatus("❌ Connection failed!")
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  const testUserFunctions = async () => {
    setStatus("Testing user functions...")
    try {
      // Test creating a user
      const testUser = await createUser({
        fid: 99999,
        username: "testuser",
        display_name: "Test User",
        pfp_url: "https://example.com/pfp.jpg"
      })
      
      if (testUser) {
        // Test fetching the user
        const fetchedUser = await getUserByFid(99999)
        setStatus("✅ User functions working!")
        setResult({ created: testUser, fetched: fetchedUser })
      } else {
        throw new Error("Failed to create user")
      }
    } catch (error) {
      setStatus("❌ User functions failed!")
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  const testDailyStats = async () => {
    setStatus("Testing daily stats...")
    try {
      const stats = await getDailyStats()
      setStatus("✅ Daily stats working!")
      setResult({ stats })
    } catch (error) {
      setStatus("❌ Daily stats failed!")
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Supabase Test</h2>
      
      <div className="space-y-2">
        <button 
          onClick={testConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Connection
        </button>
        
        <button 
          onClick={testUserFunctions}
          className="px-4 py-2 bg-green-500 text-white rounded ml-2"
        >
          Test User Functions
        </button>
        
        <button 
          onClick={testDailyStats}
          className="px-4 py-2 bg-purple-500 text-white rounded ml-2"
        >
          Test Daily Stats
        </button>
      </div>

      <div className="mt-4">
        <p className="font-semibold">{status}</p>
        {result && (
          <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
} 