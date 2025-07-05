"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useCoinTrading } from "../hooks/useCoinTrading"
import { Button } from "./ui/Button"

interface TradingInterfaceProps {
  coinAddress: string
  coinSymbol: string
  className?: string
}

export function TradingInterface({ coinAddress, coinSymbol, className = "" }: TradingInterfaceProps) {
  const [tradeAmount, setTradeAmount] = useState("0.001")
  const [tradeMode, setTradeMode] = useState<"buy" | "sell">("buy")
  const [tradeMessage, setTradeMessage] = useState("")
  const [tradeStatus, setTradeStatus] = useState<"idle" | "success" | "error">("idle")
  
  const { isConnected } = useAccount()
  const { buyCoins, sellCoins, isTrading, tradeError, canTrade } = useCoinTrading()

  const handleTrade = async () => {
    if (!canTrade) {
      setTradeStatus("error")
      setTradeMessage("Please connect your wallet first")
      return
    }

    try {
      setTradeStatus("idle")
      setTradeMessage("")

      const result = tradeMode === "buy" 
        ? await buyCoins({ coinAddress, amountInEth: tradeAmount })
        : await sellCoins({ coinAddress, amountInEth: tradeAmount })

      if (result.success) {
        setTradeStatus("success")
        setTradeMessage(
          `✅ ${tradeMode === "buy" ? "Bought" : "Sold"} ${coinSymbol} successfully! 
          Transaction: ${result.txHash.slice(0, 10)}...`
        )
      }
    } catch (error) {
      setTradeStatus("error")
      setTradeMessage(error instanceof Error ? error.message : "Trade failed")
    }
  }

  const quickAmounts = ["0.001", "0.005", "0.01", "0.05"]

  return (
    <div className={`bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 ${className}`}>
      <div className="bg-purple-200 border-2 border-black p-3 mb-4">
        <h3 className="text-xl font-black">💰 Trade ${coinSymbol}</h3>
        <p className="text-xs">Buy or sell directly in the app</p>
      </div>

      {/* Trade Mode Toggle */}
      <div className="flex border-2 border-black mb-4 rounded-lg overflow-hidden">
        <button
          onClick={() => setTradeMode("buy")}
          className={`flex-1 py-2 text-sm font-bold transition-all ${
            tradeMode === "buy"
              ? "bg-green-400 text-black"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          📈 BUY
        </button>
        <button
          onClick={() => setTradeMode("sell")}
          className={`flex-1 py-2 text-sm font-bold transition-all ${
            tradeMode === "sell"
              ? "bg-red-400 text-black"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          📉 SELL
        </button>
      </div>

      {/* Amount Input */}
      <div className="space-y-3">
        <label className="block text-sm font-bold">
          Amount ({tradeMode === "buy" ? "ETH to spend" : "Coins to sell"}):
        </label>
        <input
          type="number"
          step="0.001"
          min="0.001"
          value={tradeAmount}
          onChange={(e) => setTradeAmount(e.target.value)}
          className="w-full p-3 border-2 border-black bg-gray-100 font-mono text-sm"
          placeholder="0.001"
        />
        
        {/* Quick Amount Buttons */}
        <div className="flex gap-2">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setTradeAmount(amount)}
              className={`px-3 py-1 text-xs font-bold border-2 border-black transition-all ${
                tradeAmount === amount
                  ? "bg-yellow-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>

      {/* Trade Button */}
      <Button
        onClick={handleTrade}
        disabled={!canTrade || isTrading || !tradeAmount || parseFloat(tradeAmount) <= 0}
        className={`w-full mt-4 font-black text-lg py-3 ${
          tradeMode === "buy" 
            ? "bg-green-500 hover:bg-green-600" 
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {isTrading 
          ? `${tradeMode === "buy" ? "Buying" : "Selling"}...` 
          : `${tradeMode === "buy" ? "🚀 Buy" : "💸 Sell"} ${coinSymbol}`
        }
      </Button>

      {/* Connection Status */}
      {!isConnected && (
        <div className="mt-3 p-2 bg-yellow-100 border-2 border-black text-xs">
          <span className="font-bold">⚠️ Wallet not connected</span>
          <br />
          Connect your wallet to start trading
        </div>
      )}

      {/* Trade Status Messages */}
      {tradeMessage && (
        <div className={`mt-3 p-3 border-2 border-black text-sm ${
          tradeStatus === "success" 
            ? "bg-green-100" 
            : tradeStatus === "error" 
              ? "bg-red-100" 
              : "bg-blue-100"
        }`}>
          {tradeMessage}
        </div>
      )}

      {/* Trade Error */}
      {tradeError && (
        <div className="mt-3 p-3 bg-red-100 border-2 border-black text-sm">
          <span className="font-bold">❌ Error:</span> {tradeError}
        </div>
      )}
    </div>
  )
} 