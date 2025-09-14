import { PrismaClient } from '@prisma/client';

// Create a new Prisma client with connection pooling disabled
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL?.replace('?pgbouncer=true', '') || process.env.DATABASE_URL
    }
  }
});

async function seedSimple() {
  try {
    console.log('🌱 Seeding data...');

    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Create one shop first
    const shop = await prisma.shop.create({
      data: {
        name: 'TechZone Electronics',
        slug: 'techzone-electronics',
        description: 'Your one-stop shop for all electronics and gadgets.',
        ownerName: 'Rajesh Kumar',
        email: 'rajesh@techzone.com',
        phone: '+91 98765 43210',
        whatsapp: '+91 98765 43210',
        address: 'Shop No. 15, Govandi East, Mumbai - 400088',
        area: 'Govandi',
        category: 'Electronics',
        businessHours: 'Mon-Sat: 10 AM - 9 PM, Sun: 11 AM - 8 PM',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
        isVerified: true,
        rating: 4.5
      }
    });
    console.log(`✅ Created shop: ${shop.name}`);

    // Create one deal
    const deal = await prisma.deal.create({
      data: {
        title: 'Samsung Galaxy S23 - 20% Off',
        slug: 'samsung-galaxy-s23-20-off',
        description: 'Latest Samsung Galaxy S23 with 256GB storage. Includes free screen protector and case.',
        price: 79999,
        salePrice: 63999,
        category: 'Electronics',
        discountType: 'Percentage Off',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        area: 'Govandi',
        cod: true,
        shopId: shop.id,
        isActive: true
      }
    });
    console.log(`✅ Created deal: ${deal.title}`);

    console.log('🎉 Seeding completed!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSimple();
