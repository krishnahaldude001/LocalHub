import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, type UserRole } from '@/lib/roles'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const role = (session.user as { role?: string }).role as UserRole
    if (!hasPermission(role, 'canEditDeals')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    const {
      title,
      description,
      price,
      salePrice,
      platformId,
      shopId,
      affiliateUrl,
      rating,
      cod,
      image,
      youtubeUrl,
      gallery,
      area,
      category,
      discountType,
      isActive,
    } = body

    if (!title || !description || price === undefined || !area) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, price, area' },
        { status: 400 }
      )
    }

    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: {
        title,
        description,
        price: Number(price),
        salePrice: salePrice !== undefined && salePrice !== null ? Number(salePrice) : null,
        platformId: platformId || null,
        shopId: shopId || null,
        affiliateUrl: affiliateUrl || null,
        rating: rating !== undefined && rating !== null ? Number(rating) : null,
        cod: cod !== undefined ? Boolean(cod) : true,
        image: image || null,
        youtubeUrl: youtubeUrl || null,
        gallery: gallery || null,
        area,
        ...(category !== undefined ? { category } : {}),
        ...(discountType !== undefined ? { discountType } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
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
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const role = (session.user as { role?: string }).role as UserRole
    if (!hasPermission(role, 'canDeleteDeals')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.deal.delete({
      where: { id: params.id },
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
