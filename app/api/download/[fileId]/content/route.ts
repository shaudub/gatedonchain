import { NextRequest, NextResponse } from 'next/server'
import { getContent } from '@/lib/content-manager'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params
  const file = getContent(fileId)

  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  // In a real implementation, you would:
  // 1. Check if user has paid for this file
  // 2. Verify payment on-chain
  // 3. Serve the actual file from storage

  // For now, we'll serve the content
  return new NextResponse(file.content, {
    headers: {
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    },
  })
} 