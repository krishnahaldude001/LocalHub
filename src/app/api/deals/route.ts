import { NextRequest, NextResponse } from 'next/server';
import { createPrismaClient } from '@/lib/db-connection';

export async function POST(request: NextRequest) {
  const prisma = createPrismaClient();
  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      salePrice,
      category,
      discountType,
      image,
      gallery,
      youtubeUrl,
      area,
      shopSlug,
      cod = true
    } = body;

    // Validate required fields
    if (!title || !description || !price || !salePrice || !category || !discountType || !area || !shopSlug) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the shop
    const shop = await prisma.shop.findUnique({
      where: { slug: shopSlug }
    });

    if (!shop) {
      return NextResponse.json(
        { message: 'Shop not found' },
        { status: 404 }
      );
    }

    // Create slug from deal title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.deal.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Create deal
    const deal = await prisma.deal.create({
      data: {
        title,
        slug: finalSlug,
        description,
        price,
        salePrice,
        category,
        discountType,
        image,
        gallery,
        youtubeUrl,
        area,
        cod,
        shopId: shop.id,
        isActive: true
      },
      include: {
        shop: true
      }
    });

    return NextResponse.json(deal, { status: 201 });

  } catch (error) {
    console.error('Error creating deal:', error);
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
    const discountType = searchParams.get('discountType');
    const shopId = searchParams.get('shopId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
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

    if (discountType) {
      where.discountType = discountType;
    }

    if (shopId) {
      where.shopId = shopId;
    }

    if (minPrice || maxPrice) {
      where.salePrice = {};
      if (minPrice) {
        where.salePrice.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.salePrice.lte = parseFloat(maxPrice);
      }
    }

    // Get deals with pagination
    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { publishedAt: 'desc' }
        ],
        include: {
          shop: {
            select: {
              id: true,
              name: true,
              slug: true,
              area: true,
              phone: true,
              whatsapp: true,
              isVerified: true,
              rating: true
            }
          },
          _count: {
            select: {
              orders: true
            }
          }
        }
      }),
      prisma.deal.count({ where })
    ]);

    return NextResponse.json({
      deals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
