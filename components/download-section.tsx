"use client"

import { useState } from 'react'
import X402Client from './x402-client'

interface DownloadSectionProps {
  onPaymentSuccess?: (transactionHash: string) => void
  onPaymentError?: (errorMessage: string) => void
}

export default function DownloadSection({ onPaymentSuccess, onPaymentError }: DownloadSectionProps = {}) {
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handlePaymentSuccess = (transactionHash: string) => {
    setStatus(`Payment successful! Transaction: ${transactionHash}`)
    setError('')
    onPaymentSuccess?.(transactionHash)
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
    setStatus('')
    onPaymentError?.(errorMessage)
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Download File</h2>

      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          Click the button below to download your file. If payment is required, it will be processed automatically.
        </p>

        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Bitcoin Whitepaper</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              The original Bitcoin whitepaper by Satoshi Nakamoto - A Peer-to-Peer Electronic Cash System
            </p>
            <X402Client
              fileId="bitcoin-whitepaper"
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        </div>

                       {status && (
                 <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                   <p className="text-green-800 dark:text-green-200 text-sm">{status}</p>
                   {status.includes('Payment successful') && (
                     <div className="mt-2">
                       <button
                         onClick={async () => {
                           try {
                             const response = await fetch('/api/download/bitcoin-whitepaper')
                             if (response.ok) {
                               const data = await response.json()
                               if (data.file?.downloadUrl) {
                                 window.open(data.file.downloadUrl, '_blank')
                               }
                             }
                           } catch (error) {
                             console.error('Download failed:', error)
                           }
                         }}
                         className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                       >
                         Download Bitcoin Whitepaper
                       </button>
                     </div>
                   )}
                 </div>
               )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Powered by x402 payment protocol
        </p>
      </div>
    </div>
  )
}
