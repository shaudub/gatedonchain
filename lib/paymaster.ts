// Simplified paymaster implementation for Circle Paymaster
import { createPublicClient, http, parseEther, createWalletClient, custom, encodeFunctionData } from 'viem'
import { baseSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

// Circle Paymaster addresses for Base Sepolia
export const CIRCLE_PAYMASTER_ADDRESS = '0x4Fd9098af9ddcB41DA48A1d78F91F1398965addc' // Base Sepolia v0.7
export const USDC_CONTRACT_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' // Base Sepolia USDC

// ERC-20 transfer ABI for USDC payments
export const ERC20_TRANSFER_ABI = {
  inputs: [
    { name: 'to', type: 'address' },
    { name: 'amount', type: 'uint256' }
  ],
  name: 'transfer',
  outputs: [{ name: '', type: 'bool' }],
  stateMutability: 'nonpayable',
  type: 'function'
} as const

export interface PaymasterConfig {
  rpcUrl: string
  paymasterAddress: string
}

export const getPaymasterConfig = (): PaymasterConfig => ({
  rpcUrl: 'https://sepolia.base.org',
  paymasterAddress: CIRCLE_PAYMASTER_ADDRESS,
})

export interface SmartWalletConnection {
  address: string
  sendUserOperation: (userOp: any) => Promise<string>
  signMessage: (message: string) => Promise<string>
}

/**
 * Simplified smart wallet implementation for Circle Paymaster
 * Note: This is a basic implementation. For production, use proper ERC-4337 libraries.
 */
export async function createSmartWallet(
  walletClient: any, // From wagmi
): Promise<SmartWalletConnection> {
  try {
    const config = getPaymasterConfig()
    
    // Validate wallet client
    if (!walletClient || !walletClient.account?.address) {
      throw new Error('Invalid wallet client - no account address found')
    }
    
    const address = walletClient.account.address
    console.log('🚀 Creating smart wallet for address:', address)
    
    return {
      address,
      sendUserOperation: async (userOp: any) => {
        try {
          console.log('📤 Sending user operation (simplified):', userOp)
          
          // Validate user operation
          if (!userOp.target || !userOp.data) {
            throw new Error('Invalid user operation - missing target or data')
          }
          
          // For this demo, we'll send a regular transaction instead of a UserOperation
          // In production, this would use proper ERC-4337 libraries like @alchemy/aa-core
          console.log('⚠️  Using simplified transaction instead of UserOperation')
          
          const txHash = await walletClient.sendTransaction({
            to: userOp.target,
            data: userOp.data,
            value: userOp.value || 0n,
          })
          
          console.log('✅ Transaction sent successfully:', txHash)
          return txHash
        } catch (error) {
          console.error('❌ User operation failed:', error)
          throw new Error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      },
      signMessage: async (message: string) => {
        try {
          return await walletClient.signMessage({ message })
        } catch (error) {
          console.error('❌ Message signing failed:', error)
          throw new Error(`Message signing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      },
    }
  } catch (error) {
    console.error('❌ Failed to create smart wallet:', error)
    throw new Error(`Smart wallet creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Create a USDC transfer user operation
 */
export function createUSDCTransferUserOp(
  to: string,
  amount: string, // Amount in USDC (e.g., "1.00")
  from: string
) {
  const amountInUnits = BigInt(parseFloat(amount) * 1_000_000) // USDC has 6 decimals

  const data = encodeFunctionData({
    abi: [ERC20_TRANSFER_ABI],
    functionName: 'transfer',
    args: [to as `0x${string}`, amountInUnits]
  })

  return {
    target: USDC_CONTRACT_ADDRESS,
    data,
    value: 0n,
  }
}

/**
 * Check if user has sufficient USDC balance for payment + gas
 */
export async function checkUSDCBalance(
  userAddress: string,
  paymentAmount: string
): Promise<{ hasBalance: boolean, balance: string, required: string }> {
  try {
    const config = getPaymasterConfig()
    const publicClient = createPublicClient({
      transport: http(config.rpcUrl),
      chain: baseSepolia,
    })

    // Get USDC balance
    const balance = await publicClient.readContract({
      address: USDC_CONTRACT_ADDRESS,
      abi: [{
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      }],
      functionName: 'balanceOf',
      args: [userAddress as `0x${string}`]
    })

    const balanceInUSDC = Number(balance) / 1_000_000 // Convert from 6 decimals
    const requiredAmount = parseFloat(paymentAmount) + 0.1 // Payment + estimated gas in USDC

    return {
      hasBalance: balanceInUSDC >= requiredAmount,
      balance: balanceInUSDC.toFixed(6),
      required: requiredAmount.toFixed(6)
    }
  } catch (error) {
    console.error('Failed to check USDC balance:', error)
    return {
      hasBalance: false,
      balance: '0',
      required: paymentAmount
    }
  }
}