import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dummyShops = [
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
  }
];

const dummyDeals = [
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
    title: 'Thali Special - Unlimited',
    description: 'Authentic Indian thali with unlimited servings. Includes dal, rice, roti, vegetables, and dessert.',
    price: 299,
    salePrice: 199,
    category: 'Food & Beverages',
    discountType: 'Fixed Amount Off',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500',
    area: 'Baiganwadi',
    shopSlug: 'spice-garden-restaurant'
  }
];

async function addDummyData() {
  try {
    console.log('🌱 Adding dummy data...');

    // Create shops
    const createdShops = [];
    for (const shopData of dummyShops) {
      try {
        const existingShop = await prisma.shop.findUnique({
          where: { slug: shopData.slug }
        });

        if (existingShop) {
          console.log(`⏭️  Shop already exists: ${shopData.name}`);
          createdShops.push(existingShop);
          continue;
        }

        const shop = await prisma.shop.create({
          data: shopData
        });
        createdShops.push(shop);
        console.log(`✅ Created shop: ${shop.name}`);
      } catch (error) {
        console.log(`❌ Error creating shop ${shopData.name}:`, error);
      }
    }

    // Create deals
    for (const dealData of dummyDeals) {
      try {
        const shop = createdShops.find(s => s.slug === dealData.shopSlug);
        if (!shop) {
          console.log(`❌ Shop not found for deal: ${dealData.title}`);
          continue;
        }

        const slug = dealData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const existingDeal = await prisma.deal.findUnique({
          where: { slug: slug }
        });

        if (existingDeal) {
          console.log(`⏭️  Deal already exists: ${dealData.title}`);
          continue;
        }

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
      } catch (error) {
        console.log(`❌ Error creating deal ${dealData.title}:`, error);
      }
    }

    console.log('🎉 Dummy data addition completed!');

  } catch (error) {
    console.error('❌ Error adding dummy data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDummyData();
