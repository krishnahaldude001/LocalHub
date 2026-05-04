import { NextRequest, NextResponse } from 'next/server';
import { createPrismaClient } from '@/lib/db-connection';
import { requireSession, roleFromSession } from '@/lib/api-auth-helpers'
import { hasPermission } from '@/lib/roles'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = createPrismaClient();
  try {
    const { session, response } = await requireSession()
    if (!session) return response!

    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({
      where: { id: params.id },
      include: { shop: { select: { userId: true } } },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    const role = roleFromSession(session as any)
    const canUpdate =
      hasPermission(role, 'canManageShops') ||
      existing.shop?.userId === session.user!.id
    if (!canUpdate) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: {
        deal: true,
        shop: true,
      },
    });

    return NextResponse.json({ message: 'Order status updated successfully', order }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order status' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = createPrismaClient();
  try {
    const { session, response } = await requireSession()
    if (!session) return response!

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        deal: true,
        shop: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const role = roleFromSession(session as any)
    const canRead =
      hasPermission(role, 'canManageShops') ||
      order.shop?.userId === session.user!.id
    if (!canRead) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch order' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
