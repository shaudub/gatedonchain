"use client"

import { useState } from "react"
import Header from "@/components/header"
import WalletConnection from "@/components/wallet-connection"
import DownloadSection from "@/components/download-section"
import StatusMessage from "@/components/status-message"
import { useAccount } from "wagmi"

function HomeContent() {
  const { address, isConnected } = useAccount()
  const [status, setStatus] = useState("Connect your wallet to download the Bitcoin whitepaper")

  const handlePaymentSuccess = (transactionHash: string) => {
    setStatus(`Payment successful! Transaction: ${transactionHash}`)
  }

  const handlePaymentError = (errorMessage: string) => {
    setStatus(`Payment failed: ${errorMessage}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">Download Bitcoin Whitepaper</h1>
          <StatusMessage message={status} />
          <div className="space-y-8 mt-6">
            <WalletConnection
              isConnected={isConnected}
              walletAddress={address || ""}
              onConnect={() => {}}
              isLoading={false}
            />
            {!isConnected && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Next Step</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Please connect your wallet above to access the Bitcoin whitepaper download.
                </p>
              </div>
            )}
            {isConnected && (
              <DownloadSection 
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function Home() {
  return <HomeContent />
}
