"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import CreatePaymentLink from "@/components/create-payment-link"
import WalletConnection from "@/components/wallet-connection"
import { useAccount } from "wagmi"

interface PaymentLink {
  id: string
  slug: string
  title: string
  description?: string
  amount: string
  recipientAddress: string
  createdAt: string
  isActive: boolean
  payments: any[]
}

function HomeContent() {
  const { address, isConnected } = useAccount()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [sampleLinks, setSampleLinks] = useState<PaymentLink[]>([])

  useEffect(() => {
    fetchSampleLinks()
  }, [])

  const fetchSampleLinks = async () => {
    try {
      const response = await fetch('/api/payment-links')
      const data = await response.json()
      if (data.success) {
        setSampleLinks(data.paymentLinks.slice(0, 3)) // Show first 3 sample links
      }
    } catch (error) {
      console.error('Failed to fetch sample links:', error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Create Shareable
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Payment Links</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Generate custom payment links for USDC payments. Perfect for freelancers, creators, and businesses who want to get paid in crypto.
          </p>
          
          {!isConnected ? (
            <div className="max-w-md mx-auto">
              <WalletConnection
                isConnected={false}
                walletAddress=""
                onConnect={() => {}}
                isLoading={false}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Connect your wallet to start creating payment links
              </p>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              {showCreateForm ? 'Hide Form' : 'Create Payment Link'}
            </button>
          )}
        </div>

        {/* Create Form */}
        {isConnected && showCreateForm && (
          <div className="max-w-2xl mx-auto mb-12">
            <CreatePaymentLink onLinkCreated={() => fetchSampleLinks()} />
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Easy Sharing</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create a custom link and share it anywhere. No complex wallet addresses to copy-paste.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">USDC Payments</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Receive stable payments in USDC on Base Sepolia. Perfect for business transactions.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Instant Settlement</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Payments are processed instantly on the blockchain with full transparency.
            </p>
          </div>
        </div>

        {/* Sample Payment Links */}
        {sampleLinks.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
              Sample Payment Links
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {sampleLinks.map((link) => (
                <div key={link.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {link.title}
                  </h3>
                  {link.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {link.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${link.amount} USDC
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {link.payments.length} payment{link.payments.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <a
                    href={`/project/${link.slug}`}
                    className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    View Payment Link
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Create Link</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Set your title, amount, and recipient address to generate a shareable payment link.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Share Link</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Send your custom link to clients, customers, or anyone who needs to pay you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Get Paid</h3>
              <p className="text-gray-600 dark:text-gray-300">
                They connect their wallet, send USDC, and you receive payment instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function Home() {
  return <HomeContent />
}
