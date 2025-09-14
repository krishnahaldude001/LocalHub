import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db-connection'
import { v4 as uuidv4 } from 'uuid'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const prisma = createPrismaClient()
    const body = await request.json()
    
    const {
      dealId,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerMessage,
      orderId
    } = body

    // Validate required fields
    if (!dealId || !customerName || !customerPhone || !customerAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: dealId, customerName, customerPhone, customerAddress' },
        { status: 400 }
      )
    }

    // Verify the deal exists and get shop information
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        shop: true
      }
    })

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    if (!deal.shop) {
      return NextResponse.json(
        { error: 'Deal is not associated with a shop' },
        { status: 400 }
      )
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        id: orderId || uuidv4(),
        dealId: deal.id,
        shopId: deal.shop.id,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        customerAddress,
        customerMessage: customerMessage || null,
        status: 'pending',
        totalAmount: deal.salePrice || deal.price,
        orderType: 'cod'
      },
      include: {
        deal: true,
        shop: true
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        dealTitle: order.deal.title,
        shopName: order.shop.name
      }
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const prisma = createPrismaClient()
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get('shopId')

    if (!shopId) {
      return NextResponse.json(
        { error: 'shopId parameter is required' },
        { status: 400 }
      )
    }

    const orders = await prisma.order.findMany({
      where: { shopId },
      include: {
        deal: true,
        shop: true
      },
      orderBy: { createdAt: 'desc' }
    })

    await prisma.$disconnect()

    return NextResponse.json({ orders })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}