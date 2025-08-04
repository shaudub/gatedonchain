"use client"

interface PaymentSectionProps {
  onPayment: () => void
}

export default function PaymentSection({ onPayment }: PaymentSectionProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Payment</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300">Price:</span>
          <span className="text-gray-800 dark:text-gray-200 font-medium">10 USDC</span>
        </div>

        <button
          onClick={onPayment}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Pay with USDC
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Payment is processed securely via Circle's programmable wallets
        </p>
      </div>
    </div>
  )
}
