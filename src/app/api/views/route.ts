import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { type, contentId, userAgent, referrer } = await request.json()

    if (!type || !contentId) {
      return NextResponse.json(
        { error: 'Type and contentId are required' },
        { status: 400 }
      )
    }

    // Get client IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Create view record
    const view = await prisma.view.create({
      data: {
        type,
        contentId,
        userAgent: userAgent || null,
        ipAddress,
        referrer: referrer || null,
      }
    })

    // Update view count for the content
    if (type === 'deal') {
      await prisma.deal.update({
        where: { id: contentId },
        data: { viewCount: { increment: 1 } }
      })
    } else if (type === 'post') {
      await prisma.post.update({
        where: { id: contentId },
        data: { viewCount: { increment: 1 } }
      })
    } else if (type === 'election') {
      await prisma.election.update({
        where: { id: contentId },
        data: { viewCount: { increment: 1 } }
      })
    }

    console.log(`View tracked: ${type} - ${contentId}`)

    return NextResponse.json({
      success: true,
      viewId: view.id,
      type,
      contentId,
      timestamp: view.createdAt
    })

  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
