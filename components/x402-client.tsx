'use client'

import { useState } from 'react'
import { useAccount, useSendTransaction, useWalletClient } from 'wagmi'
import { makeX402Payment, makeX402PaymentWithPaymaster, X402PaymentRequest, WalletConnection } from '@/lib/x402'

interface X402ClientProps {
  fileId: string
  onPaymentSuccess: (transactionHash: string) => void
  onPaymentError: (error: string) => void
  usePaymaster?: boolean // New: Enable Circle Paymaster
}

export default function X402Client({ fileId, onPaymentSuccess, onPaymentError, usePaymaster = true }: X402ClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<X402PaymentRequest | null>(null)
  
  const { address, isConnected } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()
  const { data: walletClient } = useWalletClient()

  const handleDownload = async () => {
    setIsLoading(true)
    
    try {
      // Check if wallet is connected
      if (!isConnected || !address || !sendTransactionAsync) {
        onPaymentError('Please connect your wallet first')
        return
      }
      
      // First, try to access the file
      const response = await fetch(`/api/download/${fileId}`)
      
      if (response.status === 402) {
        // x402 Payment Required
        const amount = response.headers.get('X-402-Amount')
        const currency = response.headers.get('X-402-Currency')
        const paymentAddress = response.headers.get('X-402-Address')
        const description = response.headers.get('X-402-Description')
        
        if (amount && currency && paymentAddress) {
          const paymentRequest: X402PaymentRequest = {
            amount,
            currency,
            address: paymentAddress,
            description: description || 'Payment Required',
          }
          
          setPaymentDetails(paymentRequest)
          
          let paymentResult
          
          if (usePaymaster && walletClient) {
            // Use Circle Paymaster for gasless USDC payments
            console.log('🚀 Using Circle Paymaster for gasless transaction')
            paymentResult = await makeX402PaymentWithPaymaster(`/api/download/${fileId}`, paymentRequest, walletClient)
          } else {
            // Use traditional wallet connection (user pays gas in ETH)
            console.log('💰 Using traditional payment (user pays gas)')
            const walletConnection: WalletConnection = {
              address,
              sendTransaction: sendTransactionAsync,
            }
            paymentResult = await makeX402Payment(`/api/download/${fileId}`, paymentRequest, walletConnection)
          }
          
          if (paymentResult.success && (paymentResult.transactionHash || paymentResult.userOpHash)) {
            // Confirm payment with the server
            const confirmResponse = await fetch(`/api/download/${fileId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                paymentConfirmed: true,
                transactionHash: paymentResult.transactionHash,
                userOpHash: paymentResult.userOpHash,
                gaslessTransaction: paymentResult.gaslessTransaction,
              }),
            })
            
            if (confirmResponse.ok) {
              // Now download the file after successful payment
              const downloadResponse = await fetch(`/api/download/${fileId}`)
              if (downloadResponse.ok) {
                const data = await downloadResponse.json()
                if (data.file?.downloadUrl) {
                  // Trigger download
                  window.open(data.file.downloadUrl, '_blank')
                }
              }
              onPaymentSuccess(paymentResult.transactionHash || paymentResult.userOpHash || 'payment-confirmed')
            } else {
              onPaymentError('Payment confirmation failed')
            }
          } else {
            onPaymentError(paymentResult.error || 'Payment failed')
          }
        } else {
          onPaymentError('Invalid payment request')
        }
      } else if (response.ok) {
        // File is free or already paid for
        const data = await response.json()
        if (data.file?.downloadUrl) {
          // Trigger download
          window.open(data.file.downloadUrl, '_blank')
        }
      } else {
        onPaymentError(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      onPaymentError(error instanceof Error ? error.message : 'Network error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={`w-full font-medium py-3 px-4 rounded-lg transition-colors ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isLoading ? 'Processing...' : usePaymaster ? '🚀 Download (Gas-Free)' : 'Download File'}
      </button>
      
      {usePaymaster && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 dark:text-green-400">⚡</span>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Circle Paymaster Enabled - Pay gas in USDC!
            </span>
          </div>
        </div>
      )}
      
      {paymentDetails && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Payment Required {usePaymaster ? '(Gas-Free)' : ''}
          </h3>
          <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <div>Amount: {paymentDetails.amount} {paymentDetails.currency}</div>
            <div>To: {paymentDetails.address}</div>
            <div>Description: {paymentDetails.description}</div>
            {usePaymaster && (
              <div className="text-green-600 dark:text-green-400 font-medium">
                ✨ Gas fees paid in USDC via Circle Paymaster
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 