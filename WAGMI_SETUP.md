# Wagmi + RainbowKit Setup

## Overview
This project now uses **wagmi** and **RainbowKit** for wallet connections and blockchain interactions. This provides a modern, user-friendly wallet experience with support for multiple chains and wallets.

## What's Installed

### Dependencies
- `wagmi` - React hooks for Ethereum
- `@rainbow-me/rainbowkit` - Beautiful wallet connection UI
- `viem` - TypeScript interface for Ethereum
- `@tanstack/react-query` - Data fetching and caching

## Current Features

### ✅ Completed
- Wagmi provider setup with multiple chains
- RainbowKit ConnectButton integration
- Wallet connection UI
- Multi-chain support (Ethereum, Polygon, Optimism, etc.)
- TypeScript support
- Mock payment simulation

### 🔄 Next Steps (Real Implementation)
1. **Get WalletConnect Project ID**:
   - Sign up at [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy the Project ID

2. **Add Environment Variables**:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

3. **Implement Real Payments**:
   ```typescript
   // In wagmi-wallet-provider.tsx
   const { write } = useContractWrite({
     address: '0x...', // Your payment contract
     abi: [...], // Contract ABI
     functionName: 'payForContent',
   })
   ```

4. **Add Smart Contract Integration**:
   - Deploy payment contract
   - Add contract address to config
   - Implement real payment logic

## Supported Chains
- Base Mainnet
- Base Sepolia Testnet

## Supported Wallets
- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow
- And many more (via RainbowKit)

## Files Modified
- `app/providers.tsx` - Wagmi and RainbowKit providers
- `app/layout.tsx` - Wrapped with providers
- `lib/wagmi.ts` - Wagmi configuration
- `components/wagmi-wallet-provider.tsx` - Custom wallet provider
- `components/wallet-connection.tsx` - Updated to use RainbowKit

## Testing
1. Run `npm run dev`
2. Open http://localhost:3000
3. Click "Connect Wallet" to see RainbowKit modal
4. Connect any supported wallet
5. Test payment flow (currently simulated)

## Production Deployment
1. Get real WalletConnect Project ID
2. Deploy smart contracts
3. Update contract addresses
4. Test on testnets first
5. Deploy to mainnet 