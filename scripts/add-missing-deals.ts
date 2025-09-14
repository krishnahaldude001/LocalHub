import { createPrismaClient } from '../src/lib/db-connection';

const missingDeals = [
  {
    title: 'iPhone 14 Pro - Special Offer',
    description: 'Apple iPhone 14 Pro with 128GB storage. Limited time offer with free AirPods.',
    price: 129999,
    salePrice: 119999,
    category: 'Electronics',
    discountType: 'Fixed Amount Off',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    area: 'Govandi',
    shopSlug: 'techzone-electronics'
  },
  {
    title: 'Designer Sarees - 30% Off',
    description: 'Beautiful designer sarees for special occasions. Premium quality fabrics and elegant designs.',
    price: 8999,
    salePrice: 6299,
    category: 'Clothing & Fashion',
    discountType: 'Percentage Off',
    image: 'https://images.unsplash.com/photo-1594736797933-d0c0b1a0b8b8?w=500',
    area: 'Shivaji Nagar',
    shopSlug: 'fashion-hub'
  },
  {
    title: 'Biriyani Combo - Family Pack',
    description: 'Delicious chicken biriyani with raita, salad, and dessert. Perfect for family dinner.',
    price: 599,
    salePrice: 449,
    category: 'Food & Beverages',
    discountType: 'Bundle Deal',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=500',
    area: 'Baiganwadi',
    shopSlug: 'spice-garden-restaurant'
  }
];

async function addMissingDeals() {
  const prisma = createPrismaClient();
  
  try {
    console.log('🌱 Adding missing deals...');

    // Get existing shops
    const shops = await prisma.shop.findMany();
    console.log(`Found ${shops.length} existing shops`);

    // Create missing deals
    for (const dealData of missingDeals) {
      const shop = shops.find(s => s.slug === dealData.shopSlug);
      if (!shop) {
        console.log(`❌ Shop not found for deal: ${dealData.title}`);
        continue;
      }

      const slug = dealData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const deal = await prisma.deal.create({
        data: {
          title: dealData.title,
          slug: slug,
          description: dealData.description,
          price: dealData.price,
          salePrice: dealData.salePrice,
          category: dealData.category,
          discountType: dealData.discountType,
          image: dealData.image,
          area: dealData.area,
          cod: true,
          shopId: shop.id,
          isActive: true
        }
      });
      console.log(`✅ Created deal: ${deal.title}`);
    }

    console.log('🎉 Missing deals addition completed!');

  } catch (error) {
    console.error('❌ Error adding missing deals:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMissingDeals();
