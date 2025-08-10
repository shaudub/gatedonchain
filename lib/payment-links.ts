// Payment Links Manager for USDC Payment Platform

export interface PaymentLink {
  id: string
  slug: string
  title: string
  description?: string
  amount: string // USDC amount (e.g., "10.00")
  recipientAddress: string
  createdAt: string
  createdBy?: string // Optional: creator wallet address
  isActive: boolean
  payments: Payment[]
}

export interface Payment {
  id: string
  transactionHash: string
  userOpHash?: string
  payerAddress: string
  amount: string
  timestamp: string
  status: 'pending' | 'confirmed' | 'failed'
  gaslessTransaction?: boolean
}

// In-memory store (replace with database in production)
const paymentLinksStore = new Map<string, PaymentLink>()
const paymentsBySlug = new Map<string, Payment[]>()

// Helper function to generate URL-friendly slug
export function generateSlug(title: string, customSlug?: string): string {
  // If a custom slug is provided, use it (for sample/predefined links)
  if (customSlug) {
    return customSlug
  }
  
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .substring(0, 50) // Limit length
  
  // For user-created links, add a timestamp-based suffix for uniqueness
  const timestamp = Date.now().toString(36)
  return baseSlug + '-' + timestamp
}

// Create a new payment link
export function createPaymentLink(data: {
  title: string
  description?: string
  amount: string
  recipientAddress: string
  createdBy?: string
  customSlug?: string // Optional custom slug for sample/predefined links
}): PaymentLink {
  const id = Math.random().toString(36).substring(2, 15)
  const slug = generateSlug(data.title, data.customSlug)
  
  const paymentLink: PaymentLink = {
    id,
    slug,
    title: data.title,
    description: data.description,
    amount: data.amount,
    recipientAddress: data.recipientAddress,
    createdAt: new Date().toISOString(),
    createdBy: data.createdBy,
    isActive: true,
    payments: []
  }
  
  paymentLinksStore.set(slug, paymentLink)
  paymentsBySlug.set(slug, [])
  
  return paymentLink
}

// Get payment link by slug
export function getPaymentLink(slug: string): PaymentLink | null {
  return paymentLinksStore.get(slug) || null
}

// Get all payment links (for admin/dashboard)
export function getAllPaymentLinks(): PaymentLink[] {
  return Array.from(paymentLinksStore.values())
}

// Add payment to a link
export function addPayment(slug: string, paymentData: {
  transactionHash?: string
  userOpHash?: string
  payerAddress: string
  amount: string
  gaslessTransaction?: boolean
}): Payment {
  const payment: Payment = {
    id: Math.random().toString(36).substring(2, 15),
    transactionHash: paymentData.transactionHash || '',
    userOpHash: paymentData.userOpHash,
    payerAddress: paymentData.payerAddress,
    amount: paymentData.amount,
    timestamp: new Date().toISOString(),
    status: 'confirmed', // Simplified for now
    gaslessTransaction: paymentData.gaslessTransaction || false
  }
  
  // Add to payments array
  const payments = paymentsBySlug.get(slug) || []
  payments.push(payment)
  paymentsBySlug.set(slug, payments)
  
  // Update payment link
  const paymentLink = paymentLinksStore.get(slug)
  if (paymentLink) {
    paymentLink.payments = payments
    paymentLinksStore.set(slug, paymentLink)
  }
  
  return payment
}

// Get payments for a specific link
export function getPayments(slug: string): Payment[] {
  return paymentsBySlug.get(slug) || []
}

// Update payment status
export function updatePaymentStatus(slug: string, paymentId: string, status: Payment['status']): boolean {
  const payments = paymentsBySlug.get(slug) || []
  const payment = payments.find(p => p.id === paymentId)
  
  if (payment) {
    payment.status = status
    paymentsBySlug.set(slug, payments)
    
    // Update payment link
    const paymentLink = paymentLinksStore.get(slug)
    if (paymentLink) {
      paymentLink.payments = payments
      paymentLinksStore.set(slug, paymentLink)
    }
    
    return true
  }
  
  return false
}

// Deactivate payment link
export function deactivatePaymentLink(slug: string): boolean {
  const paymentLink = paymentLinksStore.get(slug)
  if (paymentLink) {
    paymentLink.isActive = false
    paymentLinksStore.set(slug, paymentLink)
    return true
  }
  return false
}

// Initialize with some sample data
export function initializeSampleData() {
  if (paymentLinksStore.size === 0) {
    // Sample payment links with stable, consistent slugs
    createPaymentLink({
      title: "Coffee Fund ☕",
      description: "Help fuel my coding sessions with coffee!",
      amount: "5.00",
      recipientAddress: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
      customSlug: "coffee-fund"
    })
    
    createPaymentLink({
      title: "Open Source Contribution 🚀",
      description: "Support my open source work on blockchain tools",
      amount: "25.00",
      recipientAddress: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
      customSlug: "open-source-contribution"
    })
    
    createPaymentLink({
      title: "Bitcoin Whitepaper Download 📄",
      description: "Get the original Bitcoin whitepaper by Satoshi Nakamoto",
      amount: "0.05",
      recipientAddress: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
      customSlug: "bitcoin-whitepaper"
    })
  }
}

// Calculate total payments for a link
export function getTotalPayments(slug: string): { count: number; total: string } {
  const payments = getPayments(slug).filter(p => p.status === 'confirmed')
  const total = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)
  
  return {
    count: payments.length,
    total: total.toFixed(2)
  }
}