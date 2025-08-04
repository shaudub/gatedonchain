import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'
import { http } from 'viem'

// Enhanced config with account abstraction support
export const config = getDefaultConfig({
  appName: 'Bitcoin Whitepaper x402 + Circle Paymaster',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c4f79cc821944d9680842e34466bfbd',
  chains: [base, baseSepolia], // Base mainnet and Sepolia testnet
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
  ssr: true,
})

// Export chain configurations for paymaster
export { base, baseSepolia } 