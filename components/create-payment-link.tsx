'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'

interface CreatePaymentLinkProps {
  onLinkCreated?: (link: any) => void
}

export default function CreatePaymentLink({ onLinkCreated }: CreatePaymentLinkProps) {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    recipientAddress: address || ''
  })
  const [createdLink, setCreatedLink] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/payment-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdBy: address
        }),
      })

      const data = await response.json()

      if (data.success) {
        setCreatedLink(data)
        onLinkCreated?.(data)
        // Reset form
        setFormData({
          title: '',
          description: '',
          amount: '',
          recipientAddress: address || ''
        })
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      alert(`Failed to create payment link: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (createdLink) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-4">
            Payment Link Created!
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Your shareable payment link:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={createdLink.url}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
              <button
                onClick={() => navigator.clipboard.writeText(createdLink.url)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
            <p><strong>Title:</strong> {createdLink.paymentLink.title}</p>
            <p><strong>Amount:</strong> ${createdLink.paymentLink.amount} USDC</p>
          </div>
          <button
            onClick={() => setCreatedLink(null)}
            className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Create Another Link
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Create Payment Link</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Coffee Fund ☕"
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Optional description of what the payment is for..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount (USDC) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
              className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div>
          <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recipient Address *
          </label>
          <input
            type="text"
            id="recipientAddress"
            name="recipientAddress"
            value={formData.recipientAddress}
            onChange={handleInputChange}
            placeholder="0x..."
            required
            pattern="^0x[a-fA-F0-9]{40}$"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-sm"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Ethereum address where USDC payments will be sent
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.title || !formData.amount || !formData.recipientAddress}
          className={`w-full font-medium py-3 px-6 rounded-lg transition-colors ${
            isLoading || !formData.title || !formData.amount || !formData.recipientAddress
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating Link...</span>
            </div>
          ) : (
            'Create Payment Link'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 How it works</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Create a shareable payment link for any USDC amount</li>
          <li>• Share the link with anyone who needs to pay you</li>
          <li>• They connect their wallet and send USDC directly</li>
          <li>• All payments are processed on Base Sepolia testnet</li>
        </ul>
      </div>
    </div>
  )
}