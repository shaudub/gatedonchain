# Bitcoin Whitepaper Download - x402 Payment Protocol Demo

A Next.js application demonstrating the x402 payment protocol for content monetization. Users can purchase and download the Bitcoin whitepaper using cryptocurrency payments (ETH or USDC) on Base Sepolia testnet.

## 🚀 Features

- **Web3 Wallet Integration**: Connect using RainbowKit with multiple wallet support
- **x402 Payment Protocol**: Frictionless, blockchain-agnostic payment system
- **Multi-Currency Support**: Pay with ETH or USDC
- **Base Sepolia Testnet**: Safe testing environment
- **Real Blockchain Transactions**: Actual on-chain payments
- **Content Management**: Extensible system for digital content

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Web3**: wagmi, RainbowKit, viem
- **UI Components**: shadcn/ui
- **Payment Protocol**: Custom x402 implementation
- **Blockchain**: Base Sepolia Testnet

## 🎯 How It Works

1. **Connect Wallet** → RainbowKit integration with Base Sepolia
2. **Select Content** → Bitcoin whitepaper available for download
3. **x402 Payment Request** → Server returns 402 status with payment details
4. **Blockchain Transaction** → Pay 1.00 USDC (or ETH equivalent)
5. **Payment Confirmation** → Server confirms on-chain transaction
6. **Content Access** → Download unlocked after successful payment

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Base Sepolia testnet ETH/USDC

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd wallet-payment-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Get Testnet Tokens

**Base Sepolia ETH:**
- [Alchemy Faucet](https://www.alchemy.com/faucets/base-sepolia)
- [Coinbase Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

**Base Sepolia USDC:**
- Get ETH first, then swap on testnet DEX
- Or use USDC-specific faucets

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

Get your WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)

### Payment Configuration

Edit `lib/content-manager.ts` to customize:
- Payment amounts
- Supported currencies
- Payment addresses
- Content library

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── download/      # x402 payment endpoints
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main application page
│   └── providers.tsx      # Web3 providers setup
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── download-section.tsx
│   ├── wallet-connection.tsx
│   └── x402-client.tsx   # x402 payment client
├── lib/                  # Utility libraries
│   ├── content-manager.ts # Content and pricing config
│   ├── wagmi.ts          # Web3 configuration
│   ├── x402.ts           # x402 protocol implementation
│   └── utils.ts          # General utilities
└── styles/               # CSS styles
```

## 💳 Payment Protocol (x402)

The x402 protocol enables frictionless payments for digital content:

1. **HTTP 402**: Server responds with payment required
2. **Payment Headers**: Amount, currency, address in response headers
3. **Blockchain Payment**: Client sends cryptocurrency transaction
4. **Payment Confirmation**: Server verifies on-chain transaction
5. **Content Delivery**: Access granted after confirmation

### Supported Currencies

- **ETH**: Native Ethereum transfers
- **USDC**: ERC-20 token transfers (6 decimals)
- **Extensible**: Easy to add more tokens

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧪 Testing

### Test the Payment Flow

1. Connect wallet to Base Sepolia
2. Ensure you have testnet USDC/ETH
3. Click "Download File"
4. Approve the transaction in your wallet
5. Wait for confirmation
6. Download the Bitcoin whitepaper

### API Testing

```bash
# Test x402 endpoint
curl http://localhost:3000/api/download/bitcoin-whitepaper

# Should return 402 with payment headers
```

## 🔐 Security Notes

- **Testnet Only**: Currently configured for Base Sepolia testnet
- **Payment Addresses**: Update recipient addresses in production
- **Environment Variables**: Keep WalletConnect Project ID secure
- **Smart Contract Audits**: Audit any custom contracts before mainnet

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Demo**: [Your deployment URL]
- **x402 Protocol**: [Learn more about x402](https://github.com/interledger/rfcs/blob/master/0000-x402-payment-required.md)
- **Base Network**: [Base Sepolia Testnet](https://base.org/)
- **RainbowKit**: [Wallet connection library](https://www.rainbowkit.com/)

## 📞 Support

- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)
- **Twitter**: [@YourHandle](https://twitter.com/yourhandle)

---

Built with ❤️ using the x402 payment protocol for the future of content monetization.