"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

interface WalletConnectionProps {
  isConnected: boolean
  walletAddress: string
  onConnect: () => void
  isLoading?: boolean
}

export default function WalletConnection({ isConnected, walletAddress, onConnect, isLoading = false }: WalletConnectionProps) {
  const { address } = useAccount()

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Wallet Connection</h2>

      <div className="flex justify-center">
        <ConnectButton />
      </div>

      {isConnected && address && (
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Status:</span>
            <span className="text-green-600 dark:text-green-400 font-medium">Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Address:</span>
            <span className="text-gray-800 dark:text-gray-200 font-mono text-sm">{address}</span>
          </div>
        </div>
      )}
    </div>
  )
}
