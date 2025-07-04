"use client"

import { useState } from 'react'
import Link from 'next/link'
import { testIPFSUpload, diagnoseCoinCreation } from '../../lib/coins'

interface IPFSTestResult {
  success: boolean;
  uri?: string;
  error?: string;
}

interface DiagnosticsResult {
  environment: {
    zoraApiKey: boolean;
    pinataJwt: boolean;
  };
  ipfsTest: {
    success: boolean;
    uri?: string;
    error?: string;
  };
}

export default function TestIPFS() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<IPFSTestResult | null>(null)
  const [diagnostics, setDiagnostics] = useState<DiagnosticsResult | null>(null)

  const handleTest = async () => {
    setIsLoading(true)
    try {
      const result = await testIPFSUpload()
      setResult(result)
      console.log('IPFS test result:', result)
    } catch (error) {
      console.error('IPFS test failed:', error)
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDiagnostics = async () => {
    setIsLoading(true)
    try {
      const result = await diagnoseCoinCreation()
      setDiagnostics(result)
      console.log('Coin creation diagnostics:', result)
    } catch (error) {
      console.error('Diagnostics failed:', error)
      setDiagnostics({ 
        environment: { zoraApiKey: false, pinataJwt: false },
        ipfsTest: { 
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error' 
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white min-h-screen">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-2">🧪 COIN CREATION DIAGNOSTICS</h1>
          <p className="text-gray-600">Test and debug coin creation functionality</p>
        </div>

        {/* Test Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleTest}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-3 border-2 border-black font-bold hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test IPFS Upload'}
          </button>
          
          <button
            onClick={handleDiagnostics}
            disabled={isLoading}
            className="bg-green-500 text-white px-6 py-3 border-2 border-black font-bold hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? 'Running...' : 'Run Full Diagnostics'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gray-100 border-2 border-black p-4">
            <h2 className="font-bold text-lg mb-2">📁 IPFS Test Results:</h2>
            <pre className="text-sm overflow-x-auto bg-white p-2 border border-gray-300">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {diagnostics && (
          <div className="bg-gray-100 border-2 border-black p-4">
            <h2 className="font-bold text-lg mb-2">🔍 Full Diagnostics:</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold">Environment Variables:</h3>
                <div className="bg-white p-2 border border-gray-300">
                  <div>ZORA_API_KEY: {diagnostics.environment?.zoraApiKey ? '✅ Set' : '❌ Missing'}</div>
                  <div>PINATA_JWT: {diagnostics.environment?.pinataJwt ? '✅ Set' : '❌ Missing'}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold">IPFS Upload Test:</h3>
                <div className="bg-white p-2 border border-gray-300">
                  <div>Status: {diagnostics.ipfsTest?.success ? '✅ Success' : '❌ Failed'}</div>
                  {diagnostics.ipfsTest?.uri && (
                    <div>URI: <a href={`https://ipfs.io/ipfs/${diagnostics.ipfsTest.uri.replace('ipfs://', '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{diagnostics.ipfsTest.uri}</a></div>
                  )}
                  {diagnostics.ipfsTest?.error && (
                    <div className="text-red-600">Error: {diagnostics.ipfsTest.error}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manual Test Data */}
        <div className="bg-yellow-100 border-2 border-black p-4">
          <h2 className="font-bold text-lg mb-2">🔧 Manual Testing Information:</h2>
          <div className="text-sm space-y-2">
            <div><strong>Current Environment:</strong> {typeof window !== 'undefined' ? 'Client' : 'Server'}</div>
            <div><strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 100) + '...' : 'N/A'}</div>
            <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
          </div>
        </div>

        {/* Back to App */}
        <div className="text-center">
          <Link
            href="/"
            className="bg-purple-500 text-white px-6 py-3 border-2 border-black font-bold inline-block hover:bg-purple-600"
          >
            ← Back to App
          </Link>
        </div>
      </div>
    </div>
  )
} 