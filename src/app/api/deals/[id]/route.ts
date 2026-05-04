import { NextRequest, NextResponse } from 'next/server';
import { createPrismaClient } from '@/lib/db-connection';
import { requireSession, roleFromSession } from '@/lib/api-auth-helpers'
import { hasPermission, type UserRole } from '@/lib/roles'

const SHOP_DEAL_PATCH_FIELDS = [
  'title', 'description', 'price', 'salePrice', 'category', 'discountType',
  'cod', 'isActive', 'image', 'gallery', 'youtubeUrl', 'area',
] as const

async function assertCanManageDeal(
  prisma: ReturnType<typeof createPrismaClient>,
  userId: string,
  role: UserRole,
  dealId: string
) {
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { shop: { select: { userId: true } } },
  })
  if (!deal) {
    return { deal: null as typeof deal, error: NextResponse.json({ message: 'Deal not found' }, { status: 404 }) }
  }
  if (hasPermission(role, 'canManageShops')) {
    return { deal, error: null }
  }
  if (!deal.shop?.userId || deal.shop.userId !== userId) {
    return { deal: null as typeof deal, error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }) }
  }
  return { deal, error: null }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = createPrismaClient();
  try {
    const { session, response } = await requireSession()
    if (!session) return response!

    const role = roleFromSession(session as any)
    const { deal: gateDeal, error } = await assertCanManageDeal(prisma, session.user!.id!, role, params.id)
    if (error) return error
    if (!gateDeal) return NextResponse.json({ message: 'Deal not found' }, { status: 404 })

    const full = await prisma.deal.findUnique({
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

    return NextResponse.json(full);

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
    const { session, response } = await requireSession()
    if (!session) return response!

    const role = roleFromSession(session as any)
    const { error } = await assertCanManageDeal(prisma, session.user!.id!, role, params.id)
    if (error) return error

    const body = await request.json();
    const data: Record<string, unknown> = {}
    for (const key of SHOP_DEAL_PATCH_FIELDS) {
      if (key in body && body[key] !== undefined) {
        data[key] = body[key]
      }
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 })
    }

    const deal = await prisma.deal.update({
      where: { id: params.id },
      data,
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
    const { session, response } = await requireSession()
    if (!session) return response!

    const role = roleFromSession(session as any)
    const { error } = await assertCanManageDeal(prisma, session.user!.id!, role, params.id)
    if (error) return error

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
