import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db-connection'

export async function POST(request: NextRequest) {
  const prisma = createPrismaClient();
  try {
    const body = await request.json()
    
    // Validate required fields based on deal type
    const requiredFields = ['title', 'description', 'price', 'area']
    
    // Check if it's a platform deal or shop deal
    const isPlatformDeal = body.platformId && body.affiliateUrl
    const isShopDeal = body.shopId && body.category
    
    if (!isPlatformDeal && !isShopDeal) {
      return NextResponse.json(
        { error: 'Deal must be either a platform deal (with platformId and affiliateUrl) or shop deal (with shopId and category)' },
        { status: 400 }
      )
    }
    
    // Add conditional required fields
    if (isPlatformDeal) {
      requiredFields.push('platformId', 'affiliateUrl')
    } else if (isShopDeal) {
      requiredFields.push('shopId', 'category')
    }
    
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
        platformId: body.platformId || null,
        shopId: body.shopId || null,
        affiliateUrl: body.affiliateUrl || null,
        rating: body.rating,
        cod: body.cod,
        image: body.image,
        youtubeUrl: body.youtubeUrl,
        gallery: body.gallery,
        area: body.area,
        category: body.category || null,
        discountType: body.discountType || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
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
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  const prisma = createPrismaClient();
  try {
    const deals = await prisma.deal.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        platform: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        shop: {
          select: {
            id: true,
            name: true,
            isVerified: true,
            rating: true
          }
        },
        _count: {
          select: { 
            clicks: true,
            orders: true
          }
        }
      }
    })

    // Transform the data to include clickCount for backward compatibility
    const transformedDeals = deals.map(deal => ({
      ...deal,
      clickCount: deal._count.clicks
    }));

    return NextResponse.json(transformedDeals)
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect();
  }
}
