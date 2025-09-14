import { NextRequest, NextResponse } from 'next/server';
import { createPrismaClient } from '@/lib/db-connection';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const prisma = createPrismaClient();
  try {
    const shop = await prisma.shop.findUnique({
      where: { slug: params.slug },
      include: {
        deals: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          include: {
            orders: {
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            deal: true
          }
        }
      }
    });

    if (!shop) {
      return NextResponse.json(
        { message: 'Shop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(shop);

  } catch (error) {
    console.error('Error fetching shop:', error);
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
  { params }: { params: { slug: string } }
) {
  const prisma = createPrismaClient();
  try {
    const body = await request.json();
    
    const shop = await prisma.shop.update({
      where: { slug: params.slug },
      data: body
    });

    return NextResponse.json(shop);

  } catch (error) {
    console.error('Error updating shop:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
