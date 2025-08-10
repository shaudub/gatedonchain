'use client'

import { useState } from 'react'
import { useAccount, useSendTransaction, useWalletClient } from 'wagmi'
import { parseUnits, encodeFunctionData } from 'viem'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import WalletConnection from './wallet-connection'

interface PaymentLink {
  id: string
  slug: string
  title: string
  description?: string
  amount: string
  recipientAddress: string
  createdAt: string
  isActive: boolean
}

interface PaymentLinkClientProps {
  paymentLink: PaymentLink
  onPaymentSuccess: (transactionHash: string, userOpHash?: string, gaslessTransaction?: boolean) => void
  onPaymentError: (error: string) => void
}

// USDC contract address on Base Sepolia
const USDC_CONTRACT_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'

// ERC-20 transfer function ABI
const ERC20_TRANSFER_ABI = {
  name: 'transfer',
  type: 'function',
  inputs: [
    { name: 'to', type: 'address' },
    { name: 'amount', type: 'uint256' }
  ]
} as const

export default function PaymentLinkClient({ paymentLink, onPaymentSuccess, onPaymentError }: PaymentLinkClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { address, isConnected } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()
  const { data: walletClient } = useWalletClient()

  const handleCryptoPayment = async () => {
    if (!isConnected || !address || !sendTransactionAsync) {
      onPaymentError('Please connect your wallet first')
      return
    }

    setIsLoading(true)

    try {
      console.log(`💰 Initiating crypto payment: ${paymentLink.amount} USDC to ${paymentLink.recipientAddress}`)

      // Convert USDC amount to proper units (6 decimals)
      const amountInUnits = parseUnits(paymentLink.amount, 6)

      // Encode the transfer function call
      const data = encodeFunctionData({
        abi: [ERC20_TRANSFER_ABI],
        functionName: 'transfer',
        args: [paymentLink.recipientAddress as `0x${string}`, amountInUnits]
      })

      // Send USDC transaction
      const transactionHash = await sendTransactionAsync({
        to: USDC_CONTRACT_ADDRESS as `0x${string}`,
        data,
        value: 0n, // No ETH value for ERC-20 transfers
      })

      console.log('✅ Crypto transaction sent:', transactionHash)
      onPaymentSuccess(transactionHash, undefined, false)

    } catch (error) {
      console.error('❌ Crypto payment failed:', error)
      onPaymentError(error instanceof Error ? error.message : 'Crypto payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStripePayment = () => {
    onPaymentError('Credit card payments coming soon! Please use crypto wallet for now.')
  }

  const handleApplePayment = () => {
    onPaymentError('Apple Pay coming soon! Please use crypto wallet for now.')
  }

  // Always require wallet connection first
  if (!isConnected) {
    return (
      <div className="space-y-6">
        {/* Payment Amount Display */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Payment Amount</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${paymentLink.amount} USDC
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium mb-2">
            🔐 Connect Wallet Required
          </p>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            Please connect your wallet to access payment methods
          </p>
        </div>
        
        <WalletConnection
          isConnected={false}
          walletAddress=""
          onConnect={() => {}}
          isLoading={false}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connected Wallet Info */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-green-800 dark:text-green-200 font-medium">Wallet Connected</span>
          <span className="text-green-700 dark:text-green-300 text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
      </div>

      {/* Payment Amount Display */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Payment Amount</p>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
          ${paymentLink.amount} USDC
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          To: {paymentLink.recipientAddress.slice(0, 6)}...{paymentLink.recipientAddress.slice(-4)}
        </p>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose Payment Method</h3>
        
        {/* Credit Card (Stripe) */}
        <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <Button 
              onClick={handleStripePayment}
              variant="ghost" 
              className="w-full h-auto p-0 justify-start"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">Credit Card</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Stripe</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Apple Pay */}
        <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <Button 
              onClick={handleApplePayment}
              variant="ghost" 
              className="w-full h-auto p-0 justify-start"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🍎</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">Apple Pay</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Quick and secure</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Crypto Wallet - Functional */}
        <Card className="border-2 border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <Button 
              onClick={handleCryptoPayment}
              variant="ghost" 
              className="w-full h-auto p-0 justify-start"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔗</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">Crypto Wallet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">USDC on Base Sepolia</p>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  {isLoading && (
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                    Available
                  </span>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Circle Paymaster Badge - Only for crypto */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <span className="text-green-600 dark:text-green-400">⚡</span>
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            Crypto payments: Gas fees automatically paid in USDC!
          </span>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Payment Instructions</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• <strong>Crypto Wallet:</strong> Ensure you have {paymentLink.amount} USDC in your wallet</li>
          <li>• <strong>Credit Card & Apple Pay:</strong> Coming soon - use crypto wallet for now</li>
          <li>• Gas fees are automatically paid in USDC - no ETH needed!</li>
          <li>• Payment confirmation may take 1-2 minutes</li>
        </ul>
      </div>
    </div>
  )
}