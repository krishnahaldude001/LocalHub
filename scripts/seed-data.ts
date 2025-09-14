import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const shops = [
  {
    name: 'TechZone Electronics',
    slug: 'techzone-electronics',
    description: 'Your one-stop shop for all electronics and gadgets. We offer the latest smartphones, laptops, and home appliances with competitive prices.',
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
  },
  {
    name: 'Fashion Hub',
    slug: 'fashion-hub',
    description: 'Trendy clothing and accessories for men, women, and kids. Latest fashion trends at affordable prices.',
    ownerName: 'Priya Sharma',
    email: 'priya@fashionhub.com',
    phone: '+91 98765 43211',
    whatsapp: '+91 98765 43211',
    address: 'Ground Floor, Shivaji Nagar Market, Mumbai - 400043',
    area: 'Shivaji Nagar',
    category: 'Clothing & Fashion',
    businessHours: 'Mon-Sun: 9 AM - 10 PM',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
    isVerified: true,
    rating: 4.2
  },
  {
    name: 'Spice Garden Restaurant',
    slug: 'spice-garden-restaurant',
    description: 'Authentic Indian cuisine with a modern twist. Fresh ingredients and traditional recipes.',
    ownerName: 'Amit Patel',
    email: 'amit@spicegarden.com',
    phone: '+91 98765 43212',
    whatsapp: '+91 98765 43212',
    address: 'Near Baiganwadi Station, Mumbai - 400043',
    area: 'Baiganwadi',
    category: 'Food & Beverages',
    businessHours: 'Mon-Sun: 7 AM - 11 PM',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
    isVerified: true,
    rating: 4.7
  },
  {
    name: 'Home Decor Plus',
    slug: 'home-decor-plus',
    description: 'Beautiful home decoration items, furniture, and interior design solutions.',
    ownerName: 'Sunita Mehta',
    email: 'sunita@homedecor.com',
    phone: '+91 98765 43213',
    whatsapp: '+91 98765 43213',
    address: 'Shop No. 8, Mankhurd Market, Mumbai - 400088',
    area: 'Mankhurd',
    category: 'Home & Garden',
    businessHours: 'Mon-Sat: 10 AM - 8 PM, Sun: 11 AM - 7 PM',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
    isVerified: false,
    rating: 4.0
  },
  {
    name: 'Beauty World',
    slug: 'beauty-world',
    description: 'Premium beauty products, cosmetics, and skincare items from top brands.',
    ownerName: 'Kavita Singh',
    email: 'kavita@beautyworld.com',
    phone: '+91 98765 43214',
    whatsapp: '+91 98765 43214',
    address: 'Chembur East, Mumbai - 400071',
    area: 'Chembur',
    category: 'Health & Beauty',
    businessHours: 'Mon-Sun: 9 AM - 9 PM',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
    isVerified: true,
    rating: 4.3
  }
];

const deals = [
  {
    title: 'Samsung Galaxy S23 - 20% Off',
    description: 'Latest Samsung Galaxy S23 with 256GB storage. Includes free screen protector and case.',
    price: 79999,
    salePrice: 63999,
    category: 'Electronics',
    discountType: 'Percentage Off',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
    area: 'Govandi',
    shopSlug: 'techzone-electronics'
  },
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
    title: 'Summer Collection - Buy 2 Get 1 Free',
    description: 'Latest summer collection for men and women. Mix and match any 3 items, pay for only 2.',
    price: 2999,
    salePrice: 1999,
    category: 'Clothing & Fashion',
    discountType: 'Buy One Get One',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
    area: 'Shivaji Nagar',
    shopSlug: 'fashion-hub'
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
    title: 'Thali Special - Unlimited',
    description: 'Authentic Indian thali with unlimited servings. Includes dal, rice, roti, vegetables, and dessert.',
    price: 299,
    salePrice: 199,
    category: 'Food & Beverages',
    discountType: 'Fixed Amount Off',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500',
    area: 'Baiganwadi',
    shopSlug: 'spice-garden-restaurant'
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
  },
  {
    title: 'Sofa Set - Living Room',
    description: '3+2+1 sofa set in premium fabric. Perfect for your living room. Free home delivery included.',
    price: 45999,
    salePrice: 35999,
    category: 'Home & Garden',
    discountType: 'Fixed Amount Off',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
    area: 'Mankhurd',
    shopSlug: 'home-decor-plus'
  },
  {
    title: 'Beauty Kit - Complete Set',
    description: 'Complete beauty kit with foundation, lipstick, eyeshadow, and skincare products.',
    price: 2999,
    salePrice: 1999,
    category: 'Health & Beauty',
    discountType: 'Bundle Deal',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
    area: 'Chembur',
    shopSlug: 'beauty-world'
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting to seed data...');

    // Create shops
    const createdShops = [];
    for (const shopData of shops) {
      const shop = await prisma.shop.create({
        data: shopData
      });
      createdShops.push(shop);
      console.log(`✅ Created shop: ${shop.name}`);
    }

    // Create deals
    for (const dealData of deals) {
      const shop = createdShops.find(s => s.slug === dealData.shopSlug);
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

    console.log('🎉 Data seeding completed successfully!');
    console.log(`📊 Created ${createdShops.length} shops and ${deals.length} deals`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
