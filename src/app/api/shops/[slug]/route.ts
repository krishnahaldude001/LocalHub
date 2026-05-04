import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth'
import { createPrismaClient } from '@/lib/db-connection';
import { authOptions } from '@/lib/auth'
import { hasPermission, type UserRole } from '@/lib/roles'
import { assertShopOwnerBySlug, requireSession, roleFromSession } from '@/lib/api-auth-helpers'

function pickShopUpdateData(body: Record<string, unknown>) {
  const allowed = [
    'name', 'description', 'ownerName', 'email', 'phone', 'whatsapp', 'address', 'area',
    'category', 'businessHours', 'image', 'status',
  ] as const
  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body && body[key] !== undefined) {
      data[key] = body[key]
    }
  }
  return data
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const prisma = createPrismaClient();
  try {
    const session = await getServerSession(authOptions)
    const shopRow = await prisma.shop.findUnique({
      where: { slug: params.slug },
      select: { userId: true },
    })

    if (!shopRow) {
      return NextResponse.json({ message: 'Shop not found' }, { status: 404 })
    }

    const role = session?.user ? roleFromSession(session as any) : ('user' as UserRole)
    const uid = session?.user?.id
    const showOrders =
      !!uid &&
      (shopRow.userId === uid || hasPermission(role, 'canManageShops'))

    const shop = await prisma.shop.findUnique({
      where: { slug: params.slug },
      include: showOrders
        ? {
            deals: {
              where: { isActive: true },
              orderBy: { createdAt: 'desc' },
              include: {
                orders: { orderBy: { createdAt: 'desc' } },
              },
            },
            orders: {
              orderBy: { createdAt: 'desc' },
              include: { deal: true },
            },
          }
        : {
            deals: {
              where: { isActive: true },
              orderBy: { createdAt: 'desc' },
            },
          },
    })

    if (!shop) {
      return NextResponse.json({ message: 'Shop not found' }, { status: 404 })
    }

    return NextResponse.json(shop)

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
    const { session, response } = await requireSession()
    if (!session) return response!

    const role = roleFromSession(session as any)
    const allowed = await assertShopOwnerBySlug(session.user!.id!, params.slug, role)
    if (!allowed) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json();
    const data = pickShopUpdateData(body as Record<string, unknown>)
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 })
    }

    const shop = await prisma.shop.update({
      where: { slug: params.slug },
      data,
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
