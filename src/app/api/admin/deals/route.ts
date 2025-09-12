import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'platformId', 'affiliateUrl', 'area']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check if slug already exists
    const existingDeal = await prisma.deal.findUnique({
      where: { slug: body.slug }
    })

    if (existingDeal) {
      return NextResponse.json(
        { error: 'A deal with this title already exists' },
        { status: 400 }
      )
    }

    // Create the deal
    const deal = await prisma.deal.create({
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description,
        price: body.price,
        salePrice: body.salePrice,
        platformId: body.platformId,
        affiliateUrl: body.affiliateUrl,
        rating: body.rating,
        cod: body.cod,
        image: body.image,
        youtubeUrl: body.youtubeUrl,
        gallery: body.gallery,
        area: body.area,
        publishedAt: new Date()
      }
    })

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { clicks: true }
        }
      }
    })

    return NextResponse.json(deals)
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
