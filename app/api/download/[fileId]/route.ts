import { NextRequest, NextResponse } from 'next/server'
import { createX402Response, handleX402Payment } from '@/lib/x402'
import { getContent } from '@/lib/content-manager'

// Simple in-memory payment tracking (in production, use a database)
const confirmedPayments = new Set<string>()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params
  const file = getContent(fileId)

  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  // Check if payment is required
  if (file.requiresPayment && file.price !== '0') {
    // Check if payment has been confirmed for this file
    if (confirmedPayments.has(fileId)) {
      // Payment already confirmed, serve the file
      return NextResponse.json({
        success: true,
        file: {
          id: file.id,
          name: file.name,
          downloadUrl: `/api/download/${fileId}/content`,
        },
      })
    }
    
    // Return x402 Payment Required response
    const paymentRequest = {
      amount: file.price,
      currency: file.currency,
      address: file.address,
      description: file.description,
    }

    const x402Response = createX402Response(paymentRequest)
    
    return new NextResponse(
      JSON.stringify(x402Response.body),
      {
        status: 402,
        headers: x402Response.headers,
      }
    )
  }

  // If no payment required or payment already made, serve the file
  return NextResponse.json({
    success: true,
    file: {
      id: file.id,
      name: file.name,
      downloadUrl: `/api/download/${fileId}/content`,
    },
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params
  const file = getContent(fileId)

  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const { paymentConfirmed, transactionHash } = body

    if (paymentConfirmed && transactionHash) {
      // In a real implementation, you would:
      // 1. Verify the transaction on-chain
      // 2. Check if payment amount matches
      // 3. Grant access to the file
      
      console.log(`Payment confirmed for file ${fileId}: ${transactionHash}`)
      
      // Mark this file as paid
      confirmedPayments.add(fileId)
      
      return NextResponse.json({
        success: true,
        file: {
          id: file.id,
          name: file.name,
          downloadUrl: `/api/download/${fileId}/content`,
        },
      })
    }

    return NextResponse.json({ error: 'Invalid payment confirmation' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
} 