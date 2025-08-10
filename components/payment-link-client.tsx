'use client'

import { useState } from 'react'
import { useAccount, useSendTransaction, useWalletClient } from 'wagmi'
import { parseUnits, encodeFunctionData } from 'viem'
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

  const handlePayment = async () => {
    if (!isConnected || !address || !sendTransactionAsync) {
      onPaymentError('Please connect your wallet first')
      return
    }

    setIsLoading(true)

    try {
      console.log(`💰 Initiating payment: ${paymentLink.amount} USDC to ${paymentLink.recipientAddress}`)

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

      console.log('✅ Transaction sent:', transactionHash)
      onPaymentSuccess(transactionHash, undefined, false)

    } catch (error) {
      console.error('❌ Payment failed:', error)
      onPaymentError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Connect Wallet to Pay</h2>
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
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-green-800 dark:text-green-200 font-medium">Wallet Connected</span>
        </div>
        <div className="text-sm text-green-700 dark:text-green-300">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      </div>

      {/* Payment Details */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Payment Details</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Amount:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{paymentLink.amount} USDC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">To:</span>
            <span className="font-mono text-sm text-gray-800 dark:text-gray-200">
              {paymentLink.recipientAddress.slice(0, 10)}...{paymentLink.recipientAddress.slice(-8)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Network:</span>
            <span className="text-gray-800 dark:text-gray-200">Base Sepolia</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isLoading}
          className={`w-full font-medium py-4 px-6 rounded-lg transition-all ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span>💳</span>
              <span>Send ${paymentLink.amount} USDC</span>
            </div>
          )}
        </button>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Make sure you have sufficient USDC balance and ETH for gas fees</p>
          <p className="mt-1">Transaction will be processed on Base Sepolia testnet</p>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Payment Instructions</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Ensure you have {paymentLink.amount} USDC in your wallet</li>
          <li>• Keep some ETH for gas fees (usually $1-3)</li>
          <li>• Confirm the transaction in your wallet when prompted</li>
          <li>• Payment confirmation may take 1-2 minutes</li>
        </ul>
      </div>
    </div>
  )
}