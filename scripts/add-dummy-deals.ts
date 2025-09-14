import { createPrismaClient } from '../src/lib/db-connection';

const prisma = createPrismaClient();

async function addDummyDeals() {
  try {
    console.log('Adding dummy deals for TechMart Electronics...');

    // Find the shop
    const shop = await prisma.shop.findFirst({
      where: { name: 'TechMart Electronics' }
    });

    if (!shop) {
      console.log('❌ Shop not found! Please run create-dummy-shop.ts first.');
      return;
    }

    // Check if deals already exist
    const existingDeals = await prisma.deal.findMany({
      where: { shopId: shop.id }
    });

    if (existingDeals.length > 0) {
      console.log('✅ Deals already exist for this shop!');
      console.log('Existing deals:', existingDeals.length);
      return;
    }

    // Create dummy deals
    const deals = [
      {
        title: 'Samsung Galaxy S24 - 20% Off',
        description: 'Latest Samsung Galaxy S24 with 20% discount. Available in all colors.',
        price: 79999,
        salePrice: 63999,
        category: 'Smartphones',
        discountType: 'percentage',
        cod: true,
        isActive: true,
        shopId: shop.id,
        slug: 'samsung-galaxy-s24-20-off',
        area: shop.area
      },
      {
        title: 'MacBook Air M2 - ₹15,000 Off',
        description: 'Apple MacBook Air M2 with 8GB RAM and 256GB SSD. Limited time offer.',
        price: 99999,
        salePrice: 84999,
        category: 'Laptops',
        discountType: 'fixed',
        cod: true,
        isActive: true,
        shopId: shop.id,
        slug: 'macbook-air-m2-15000-off',
        area: shop.area
      },
      {
        title: 'Sony WH-1000XM5 Headphones - 25% Off',
        description: 'Premium noise-cancelling headphones with 30-hour battery life.',
        price: 29990,
        salePrice: 22492,
        category: 'Audio',
        discountType: 'percentage',
        cod: true,
        isActive: true,
        shopId: shop.id,
        slug: 'sony-wh-1000xm5-headphones-25-off',
        area: shop.area
      },
      {
        title: 'iPhone 15 Pro - ₹10,000 Off',
        description: 'Latest iPhone 15 Pro with titanium design and A17 Pro chip.',
        price: 134900,
        salePrice: 124900,
        category: 'Smartphones',
        discountType: 'fixed',
        cod: true,
        isActive: true,
        shopId: shop.id,
        slug: 'iphone-15-pro-10000-off',
        area: shop.area
      },
      {
        title: 'Dell XPS 13 - 18% Off',
        description: 'Ultra-thin laptop with 13.4-inch display and Intel i7 processor.',
        price: 129990,
        salePrice: 106590,
        category: 'Laptops',
        discountType: 'percentage',
        cod: true,
        isActive: true,
        shopId: shop.id,
        slug: 'dell-xps-13-18-off',
        area: shop.area
      }
    ];

    // Create deals
    for (const dealData of deals) {
      await prisma.deal.create({
        data: dealData
      });
    }

    console.log('✅ Successfully added 5 dummy deals!');
    console.log('\n📱 Deals Added:');
    deals.forEach((deal, index) => {
      const discount = deal.discountType === 'percentage' 
        ? `${Math.round((1 - deal.salePrice / deal.price) * 100)}% Off`
        : `₹${deal.price - deal.salePrice} Off`;
      console.log(`${index + 1}. ${deal.title} - ${discount}`);
    });

    console.log('\n🌐 Test the deals:');
    console.log('- Shop Page: http://localhost:3000/shop/techmart-electronics');
    console.log('- All Deals: http://localhost:3000/deals');
    console.log('- Shop Dashboard: http://localhost:3000/shop/techmart-electronics/dashboard');

  } catch (error) {
    console.error('❌ Error adding dummy deals:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDummyDeals();
