import { NextRequest, NextResponse } from 'next/server';
import { createPrismaClient } from '@/lib/db-connection';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = createPrismaClient();
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            area: true,
            phone: true,
            whatsapp: true,
            address: true,
            businessHours: true,
            isVerified: true,
            rating: true
          }
        },
        orders: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!deal) {
      return NextResponse.json(
        { message: 'Deal not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.deal.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json(deal);

  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = createPrismaClient();
  try {
    const body = await request.json();
    
    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: body,
      include: {
        shop: true
      }
    });

    return NextResponse.json(deal);

  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = createPrismaClient();
  try {
    await prisma.deal.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Deal deleted successfully' });

  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
