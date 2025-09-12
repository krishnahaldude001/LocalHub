import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'platform', 'affiliateUrl', 'area']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Update the deal
    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        salePrice: body.salePrice,
        platform: body.platform,
        affiliateUrl: body.affiliateUrl,
        rating: body.rating,
        cod: body.cod,
        image: body.image,
        youtubeUrl: body.youtubeUrl,
        gallery: body.gallery,
        area: body.area,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(deal)
  } catch (error) {
    console.error('Error updating deal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Delete the deal
    await prisma.deal.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Deal deleted successfully' })
  } catch (error) {
    console.error('Error deleting deal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
