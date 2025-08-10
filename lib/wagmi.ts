import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'
import { http } from 'viem'

// Enhanced config with account abstraction support
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId || projectId === 'YOUR_PROJECT_ID_HERE') {
  console.error('❌ WalletConnect Project ID not configured!')
  console.error('Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env.local')
  console.error('Get your project ID from: https://cloud.reown.com/')
}

export const config = getDefaultConfig({
  appName: 'Bitcoin Whitepaper x402 + Circle Paymaster',
  projectId: projectId || 'demo-project-id', // Fallback for development
  chains: [base, baseSepolia], // Base mainnet and Sepolia testnet
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
  ssr: true,
})

// Export chain configurations for paymaster
export { base, baseSepolia } 