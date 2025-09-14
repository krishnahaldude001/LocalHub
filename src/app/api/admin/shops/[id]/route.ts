import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db-connection'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const prisma = createPrismaClient()
  try {
    const { status, activationNotes, paymentReference } = await request.json()

    if (!status || !['pending', 'active', 'suspended', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updateData: any = {
      status,
      activationNotes: activationNotes || null,
      paymentReference: paymentReference || null
    }

    // If activating the shop, set activation details
    if (status === 'active') {
      updateData.activatedAt = new Date()
      updateData.activatedBy = session.user.id
      updateData.isVerified = true
    }

    const updatedShop = await prisma.shop.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      shop: updatedShop,
      message: `Shop ${status === 'active' ? 'activated' : 'status updated'} successfully`
    })

  } catch (error: any) {
    console.error('Error updating shop status:', error)
    return NextResponse.json({ error: error.message || 'Failed to update shop status' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const prisma = createPrismaClient()
  try {
    const shop = await prisma.shop.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        deals: {
          select: {
            id: true,
            title: true,
            isActive: true,
            createdAt: true
          }
        },
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true
          }
        }
      }
    })

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    return NextResponse.json({ shop })

  } catch (error: any) {
    console.error('Error fetching shop details:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch shop details' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
