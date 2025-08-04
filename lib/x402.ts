// x402 Payment Protocol Utilities
import { parseEther, parseUnits, encodeFunctionData } from 'viem'

export interface X402PaymentRequest {
  amount: string
  currency: string
  address: string
  description?: string
  metadata?: Record<string, any>
}

export interface X402PaymentResponse {
  success: boolean
  transactionHash?: string
  error?: string
}

export interface WalletConnection {
  address: string
  sendTransaction: (params: {
    to: string
    value?: bigint
    data?: string
  }) => Promise<string>
}

// USDC contract address on Base Sepolia
const USDC_CONTRACT_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'

// ERC-20 transfer function ABI
const ERC20_TRANSFER_ABI = {
  name: 'transfer',
  type: 'function',
  inputs: [
    { name: 'to', type: 'address' },
    { name: 'amount', type: 'uint256' }
  ]
} as const

// x402 HTTP Response Helper
export function createX402Response(paymentRequest: X402PaymentRequest) {
  return {
    status: 402,
    headers: {
      'X-402-Amount': paymentRequest.amount,
      'X-402-Currency': paymentRequest.currency,
      'X-402-Address': paymentRequest.address,
      'X-402-Description': paymentRequest.description || 'Payment Required',
      'Content-Type': 'application/json',
    },
    body: {
      error: 'Payment Required',
      x402: paymentRequest,
    },
  }
}

// x402 Payment Handler
export async function handleX402Payment(
  amount: string,
  currency: string,
  destinationAddress: string,
  walletConnection: WalletConnection,
  description?: string
): Promise<X402PaymentResponse> {
  try {
    console.log(`x402 Payment Request: ${amount} ${currency} to ${destinationAddress}`)
    
    if (currency === 'ETH') {
      // ETH transfer
      const valueInWei = parseEther(amount)
      
      const transactionHash = await walletConnection.sendTransaction({
        to: destinationAddress as `0x${string}`,
        value: valueInWei,
      })
      
      return {
        success: true,
        transactionHash,
      }
    } else if (currency === 'USDC') {
      // USDC (ERC-20) transfer
      const valueInUnits = parseUnits(amount, 6) // USDC has 6 decimals
      
      // Encode the transfer function call
      const data = encodeFunctionData({
        abi: [ERC20_TRANSFER_ABI],
        functionName: 'transfer',
        args: [destinationAddress as `0x${string}`, valueInUnits]
      })
      
      // Send transaction to USDC contract
      const transactionHash = await walletConnection.sendTransaction({
        to: USDC_CONTRACT_ADDRESS as `0x${string}`,
        data,
        value: 0n, // No ETH value for ERC-20 transfers
      })
      
      return {
        success: true,
        transactionHash,
      }
    } else {
      throw new Error(`Unsupported currency: ${currency}`)
    }
  } catch (error) {
    console.error('Payment failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed',
    }
  }
}

// x402 Client Helper
export async function makeX402Payment(
  url: string,
  paymentRequest: X402PaymentRequest,
  walletConnection: WalletConnection
): Promise<X402PaymentResponse> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.status === 402) {
      // Handle x402 payment request
      const x402Data = response.headers.get('X-402-Amount')
      if (x402Data) {
        // Process the payment with real wallet connection
        return await handleX402Payment(
          paymentRequest.amount,
          paymentRequest.currency,
          paymentRequest.address,
          walletConnection,
          paymentRequest.description
        )
      }
    }

    if (response.ok) {
      return { success: true }
    }

    return {
      success: false,
      error: `HTTP ${response.status}: ${response.statusText}`,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
} 