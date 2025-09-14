import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createPrismaClient } from '@/lib/db-connection';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const prisma = createPrismaClient();
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        shops: {
          include: {
            deals: {
              where: { isActive: true },
              take: 3,
              orderBy: { createdAt: 'desc' }
            },
            _count: {
              select: {
                deals: {
                  where: { isActive: true }
                },
                orders: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      shops: user.shops
    });

  } catch (error) {
    console.error('Error fetching user shops:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
