import { NextRequest, NextResponse } from 'next/server';
import { createPrismaClient } from '@/lib/db-connection';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = createPrismaClient();
  try {
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
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

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch order' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
