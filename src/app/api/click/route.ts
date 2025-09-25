import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { dealId } = await request.json()

    if (!dealId) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      )
    }

    // Verify the deal exists
    const deal = await prisma.deal.findUnique({
      where: { id: dealId }
    })

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    // Record the click
    const click = await prisma.click.create({
      data: {
        dealId: dealId,
      }
    })

    console.log(`Click tracked for deal: ${dealId}`)

    return NextResponse.json({
      success: true,
      clickId: click.id,
      dealId: dealId,
      timestamp: click.createdAt
    })

  } catch (error) {
    console.error('Error tracking click:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
