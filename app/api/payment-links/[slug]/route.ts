import { NextRequest, NextResponse } from 'next/server'
import { getPaymentLink, addPayment, getTotalPayments, initializeSampleData } from '@/lib/payment-links'

// Initialize sample data on first load
initializeSampleData()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const paymentLink = getPaymentLink(slug)

    if (!paymentLink) {
      return NextResponse.json(
        { success: false, error: 'Payment link not found' },
        { status: 404 }
      )
    }

    if (!paymentLink.isActive) {
      return NextResponse.json(
        { success: false, error: 'Payment link is no longer active' },
        { status: 410 }
      )
    }

    const stats = getTotalPayments(slug)

    return NextResponse.json({
      success: true,
      paymentLink,
      stats
    })
  } catch (error) {
    console.error('Failed to get payment link:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get payment link' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const paymentLink = getPaymentLink(slug)

    if (!paymentLink) {
      return NextResponse.json(
        { success: false, error: 'Payment link not found' },
        { status: 404 }
      )
    }

    if (!paymentLink.isActive) {
      return NextResponse.json(
        { success: false, error: 'Payment link is no longer active' },
        { status: 410 }
      )
    }

    const body = await request.json()
    const { transactionHash, userOpHash, payerAddress, amount, gaslessTransaction } = body

    // Validation
    if (!payerAddress || (!transactionHash && !userOpHash)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: payerAddress and transaction ID' },
        { status: 400 }
      )
    }

    // Validate amount matches expected amount
    const expectedAmount = parseFloat(paymentLink.amount)
    const paidAmount = parseFloat(amount)
    
    if (Math.abs(expectedAmount - paidAmount) > 0.01) { // Allow small floating point differences
      return NextResponse.json(
        { success: false, error: `Amount mismatch. Expected: ${paymentLink.amount} USDC, Received: ${amount} USDC` },
        { status: 400 }
      )
    }

    const payment = addPayment(slug, {
      transactionHash,
      userOpHash,
      payerAddress,
      amount: paymentLink.amount, // Use the expected amount
      gaslessTransaction
    })

    console.log(`💰 Payment received for "${paymentLink.title}": ${payment.amount} USDC from ${payerAddress}`)
    console.log(`🔗 Transaction Hash: ${transactionHash || 'N/A'}`)
    console.log(`⚡ User Op Hash: ${userOpHash || 'N/A'}`)
    console.log(`🏦 Recipient: ${paymentLink.recipientAddress}`)
    console.log(`💳 Gasless Transaction: ${gaslessTransaction ? 'Yes' : 'No'}`)

    return NextResponse.json({
      success: true,
      payment,
      message: 'Payment recorded successfully'
    })
  } catch (error) {
    console.error('Failed to record payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record payment' },
      { status: 500 }
    )
  }
}