'use client'

import { useState } from 'react'
import { useAccount, useSendTransaction } from 'wagmi'
import { makeX402Payment, X402PaymentRequest, WalletConnection } from '@/lib/x402'

interface X402ClientProps {
  fileId: string
  onPaymentSuccess: (transactionHash: string) => void
  onPaymentError: (error: string) => void
}

export default function X402Client({ fileId, onPaymentSuccess, onPaymentError }: X402ClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<X402PaymentRequest | null>(null)
  
  const { address, isConnected } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()

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
          
          // Create wallet connection object
          const walletConnection: WalletConnection = {
            address,
            sendTransaction: sendTransactionAsync,
          }
          
          // Process the payment
          const paymentResult = await makeX402Payment(`/api/download/${fileId}`, paymentRequest, walletConnection)
          
          if (paymentResult.success && paymentResult.transactionHash) {
            // Confirm payment with the server
            const confirmResponse = await fetch(`/api/download/${fileId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                paymentConfirmed: true,
                transactionHash: paymentResult.transactionHash,
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
              onPaymentSuccess(paymentResult.transactionHash)
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
        {isLoading ? 'Processing...' : 'Download File'}
      </button>
      
      {paymentDetails && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Payment Required</h3>
          <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <div>Amount: {paymentDetails.amount} {paymentDetails.currency}</div>
            <div>To: {paymentDetails.address}</div>
            <div>Description: {paymentDetails.description}</div>
          </div>
        </div>
      )}
    </div>
  )
} 