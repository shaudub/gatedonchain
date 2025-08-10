import { NextRequest, NextResponse } from 'next/server'
import { createPaymentLink, getAllPaymentLinks, initializeSampleData } from '@/lib/payment-links'

// Initialize sample data on first load
initializeSampleData()

export async function GET() {
  try {
    const paymentLinks = getAllPaymentLinks()
    return NextResponse.json({ success: true, paymentLinks })
  } catch (error) {
    console.error('Failed to get payment links:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get payment links' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, amount, recipientAddress, createdBy } = body

    // Validation
    if (!title || !amount || !recipientAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, amount, recipientAddress' },
        { status: 400 }
      )
    }

    // Validate amount is a valid number
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be a positive number' },
        { status: 400 }
      )
    }

    // Validate Ethereum address format (basic check)
    if (!recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Ethereum address format' },
        { status: 400 }
      )
    }

    const paymentLink = createPaymentLink({
      title,
      description,
      amount: amountNum.toFixed(2), // Ensure 2 decimal places
      recipientAddress,
      createdBy
    })

    return NextResponse.json({ 
      success: true, 
      paymentLink,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/project/${paymentLink.slug}`
    })
  } catch (error) {
    console.error('Failed to create payment link:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment link' },
      { status: 500 }
    )
  }
}