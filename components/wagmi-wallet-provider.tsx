'use client'

import React, { createContext, useContext } from 'react'
import { useAccount, useBalance, useContractWrite } from 'wagmi'
import { useConnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

type WagmiWalletContextType = {
  // Account state
  address: string | undefined
  isConnected: boolean
  isConnecting: boolean
  
  // Balance
  balance: any
  
  // Actions
  connect: (connector: any) => void
  disconnect: () => void
  
  // Contract interactions
  write: any
  isLoading: boolean
  error: any
  
  // Custom payment function
  sendPayment: (amount: string, destinationAddress: string) => Promise<boolean>
}

const WagmiWalletContext = createContext<WagmiWalletContextType | null>(null)

export const WagmiWalletProvider = ({ children }: { children: React.ReactNode }) => {
  // wagmi hooks
  const { address, isConnected } = useAccount()
  const { connect, connectors, isConnecting } = useConnect()
  const { data: balance } = useBalance({
    address,
  })

  // For now, we'll simulate contract interactions
  const isLoading = false
  const error = null
  const write = null

  const disconnect = () => {
    // wagmi doesn't have a direct disconnect hook, 
    // you'd typically use a wallet connector's disconnect method
  }

  const sendPayment = async (amount: string, destinationAddress: string): Promise<boolean> => {
    if (!address || !isConnected) {
      throw new Error('Wallet not connected')
    }

    try {
      // Simulate payment for now
      await new Promise(resolve => setTimeout(resolve, 2000))
      return true
    } catch (err) {
      console.error('Payment failed:', err)
      return false
    }
  }

  return (
    <WagmiWalletContext.Provider 
      value={{ 
        address,
        isConnected,
        isConnecting,
        balance,
        connect,
        disconnect,
        write,
        isLoading,
        error,
        sendPayment
      }}
    >
      {children}
    </WagmiWalletContext.Provider>
  )
}

export const useWagmiWallet = () => {
  const context = useContext(WagmiWalletContext)
  if (!context) throw new Error('useWagmiWallet must be used within a WagmiWalletProvider')
  return context
} 