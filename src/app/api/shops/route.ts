import { NextRequest, NextResponse } from 'next/server';
import { createPrismaClient } from '@/lib/db-connection';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const prisma = createPrismaClient();
  try {
    const body = await request.json();
    const {
      name,
      description,
      ownerName,
      email,
      username,
      phone,
      whatsapp,
      address,
      area,
      category,
      businessHours,
      image,
      password
    } = body;

    // Validate required fields
    if (!name || !ownerName || !email || !username || !phone || !address || !area || !category || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if shop with same name or email already exists
    const existingShop = await prisma.shop.findFirst({
      where: {
        OR: [
          { name: name },
          { email: email }
        ]
      }
    });

    if (existingShop) {
      return NextResponse.json(
        { message: 'Shop with this name or email already exists' },
        { status: 400 }
      );
    }

    // Check if user with same email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create slug from shop name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.shop.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Hash password for user account
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account and shop in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user account (use username/mobile as email for login)
      const user = await tx.user.create({
        data: {
          name: ownerName,
          email: username, // Use mobile number as email for login
          password: hashedPassword,
          role: 'user', // Shop owners are regular users with shop access
          emailVerified: new Date()
        }
      });

      // Create shop
      const shop = await tx.shop.create({
        data: {
          name,
          slug: finalSlug,
          description,
          ownerName,
          email,
          phone,
          whatsapp,
          address,
          area,
          category,
          businessHours,
          image,
          isVerified: false, // Will be verified by admin
          isActive: true,
          userId: user.id // Link shop to user
        }
      });

      return { user, shop };
    });

    return NextResponse.json({
      message: 'Shop registered successfully! You can now login with your email and password.',
      shop: result.shop,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  const prisma = createPrismaClient();
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get('area');
    const category = searchParams.get('category');
    const verified = searchParams.get('verified');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true
    };

    if (area) {
      where.area = area;
    }

    if (category) {
      where.category = category;
    }

    if (verified === 'true') {
      where.isVerified = true;
    }

    // Get shops with pagination
    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isVerified: 'desc' },
          { rating: 'desc' },
          { createdAt: 'desc' }
        ],
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
              }
            }
          }
        }
      }),
      prisma.shop.count({ where })
    ]);

    return NextResponse.json({
      shops,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
