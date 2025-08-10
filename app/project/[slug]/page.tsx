"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import Header from '@/components/header'
import PaymentLinkClient from '@/components/payment-link-client'
import StatusMessage from '@/components/status-message'

interface PaymentLink {
  id: string
  slug: string
  title: string
  description?: string
  amount: string
  recipientAddress: string
  createdAt: string
  isActive: boolean
  payments: Payment[]
}

interface Payment {
  id: string
  transactionHash: string
  userOpHash?: string
  payerAddress: string
  amount: string
  timestamp: string
  status: 'pending' | 'confirmed' | 'failed'
  gaslessTransaction?: boolean
}

interface PaymentStats {
  count: number
  total: string
}

export default function PaymentLinkPage() {
  const params = useParams()
  const slug = params?.slug as string
  const { address, isConnected } = useAccount()
  
  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null)
  const [stats, setStats] = useState<PaymentStats>({ count: 0, total: '0.00' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    if (slug) {
      fetchPaymentLink()
    }
  }, [slug])

  const fetchPaymentLink = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/payment-links/${slug}`)
      const data = await response.json()

      if (data.success) {
        setPaymentLink(data.paymentLink)
        setStats(data.stats)
        setError('')
      } else {
        setError(data.error || 'Payment link not found')
      }
    } catch (err) {
      setError('Failed to load payment link')
      console.error('Error fetching payment link:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (transactionHash: string, userOpHash?: string, gaslessTransaction?: boolean) => {
    if (!paymentLink || !address) return

    try {
      const response = await fetch(`/api/payment-links/${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionHash,
          userOpHash,
          payerAddress: address,
          amount: paymentLink.amount,
          gaslessTransaction
        }),
      })

      const data = await response.json()

      if (data.success) {
        const txHash = userOpHash || transactionHash
        const explorerUrl = `https://sepolia.basescan.org/tx/${txHash}`
        setStatus(
          `✅ Payment successful! ${paymentLink.amount} USDC sent to ${paymentLink.title}\n` +
          `🔗 Transaction: ${txHash}\n` +
          `📋 View on explorer: ${explorerUrl}`
        )
        // Refresh payment link data to show updated stats
        fetchPaymentLink()
      } else {
        setStatus(`❌ Payment recording failed: ${data.error}`)
      }
    } catch (error) {
      setStatus(`❌ Failed to record payment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handlePaymentError = (errorMessage: string) => {
    setStatus(`❌ Payment failed: ${errorMessage}`)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">😕</div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Payment Link Not Found</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
              <a 
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!paymentLink) return null

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          {/* Payment Link Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {paymentLink.title}
            </h1>
            {paymentLink.description && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {paymentLink.description}
              </p>
            )}
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                ${paymentLink.amount} USDC
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                To: {paymentLink.recipientAddress.slice(0, 6)}...{paymentLink.recipientAddress.slice(-4)}
              </div>
            </div>

            {/* Payment Stats */}
            {stats.count > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  💰 {stats.count} payment{stats.count !== 1 ? 's' : ''} received • ${stats.total} USDC total
                </div>
              </div>
            )}
          </div>

          {/* Status Message */}
          {status && (
            <div className="mb-6">
              <StatusMessage message={status} />
            </div>
          )}

          {/* Wallet Connection & Payment */}
          <div className="space-y-6">
            {!isConnected ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Connect Wallet to Pay</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Connect your wallet to send ${paymentLink.amount} USDC to {paymentLink.title}
                </p>
                {/* Wallet connection will be handled by the existing WalletConnection component */}
              </div>
            ) : (
              <PaymentLinkClient
                paymentLink={paymentLink}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Powered by USDC payments on Base Sepolia testnet</p>
              <p className="mt-1">Created {new Date(paymentLink.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}