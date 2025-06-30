"use client";

import { useState } from 'react';
import { testIPFSUpload } from '../lib/coins';
import { Button } from '../components/ui/Button';

export default function TestIPFS() {
  const [result, setResult] = useState<{ success: boolean; uri?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const testResult = await testIPFSUpload();
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <h1 className="text-3xl font-black mb-6">🧪 IPFS Upload Test</h1>
          
          <div className="space-y-4">
            <p className="text-lg font-bold">
              Test your Pinata IPFS integration before creating real coins!
            </p>
            
            <Button 
              onClick={handleTest}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Testing IPFS Upload..." : "🚀 Test IPFS Upload"}
            </Button>
            
            {result && (
              <div className={`p-4 border-2 border-black ${
                result.success ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <h3 className="font-black text-lg mb-2">
                  {result.success ? "✅ Success!" : "❌ Failed"}
                </h3>
                
                {result.success && result.uri && (
                  <div className="space-y-2">
                    <p className="font-bold">Metadata URI:</p>
                    <code className="block bg-gray-100 p-2 text-sm break-all">
                      {result.uri}
                    </code>
                    <p className="text-sm text-gray-600">
                      ✨ Your IPFS upload is working! You can now create coins with real metadata.
                    </p>
                  </div>
                )}
                
                {result.error && (
                  <div className="space-y-2">
                    <p className="font-bold text-red-600">Error:</p>
                    <code className="block bg-gray-100 p-2 text-sm">
                      {result.error}
                    </code>
                    <p className="text-sm text-gray-600">
                      Check your PINATA_JWT environment variable and API key permissions.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-yellow-100 border-2 border-black p-4">
              <h4 className="font-black mb-2">📋 Setup Checklist:</h4>
              <ul className="text-sm space-y-1">
                <li>✅ Create Pinata account at pinata.cloud</li>
                <li>✅ Generate API key with Files: CREATE, READ permissions</li>
                <li>✅ Add PINATA_JWT to your .env.local file</li>
                <li>✅ Run this test to verify its working</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 