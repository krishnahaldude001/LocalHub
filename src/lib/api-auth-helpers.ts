import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { createPrismaClient } from '@/lib/db-connection'
import { hasPermission, type UserRole } from '@/lib/roles'

export async function requireSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return {
      session: null as null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
  return { session, response: null }
}

export function roleFromSession(session: NonNullable<Awaited<ReturnType<typeof getServerSession>>>) {
  return ((session.user as { role?: string }).role as UserRole) || 'user'
}

export async function assertShopOwnerBySlug(userId: string, slug: string, role: UserRole) {
  if (hasPermission(role, 'canManageShops')) {
    return true
  }
  const prisma = createPrismaClient()
  try {
    const shop = await prisma.shop.findUnique({
      where: { slug },
      select: { userId: true },
    })
    return shop?.userId === userId
  } finally {
    await prisma.$disconnect()
  }
}
