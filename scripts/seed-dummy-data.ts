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
    image: 'https://via.placeholder.com/500x300/4F46E5/FFFFFF?text=Electronics+Shop',
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
    image: 'https://via.placeholder.com/500x300/EC4899/FFFFFF?text=Fashion+Store',
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
  },
  {
    name: 'Sports Zone',
    slug: 'sports-zone',
    description: 'Sports equipment, fitness gear, and athletic wear for all sports enthusiasts.',
    ownerName: 'Vikram Reddy',
    email: 'vikram@sportszone.com',
    phone: '+91 98765 43215',
    whatsapp: '+91 98765 43215',
    address: 'Kurla West, Mumbai - 400070',
    area: 'Kurla',
    category: 'Sports & Fitness',
    businessHours: 'Mon-Sat: 8 AM - 9 PM, Sun: 9 AM - 8 PM',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
    isVerified: true,
    rating: 4.4
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
    image: 'https://via.placeholder.com/500x300/10B981/FFFFFF?text=Samsung+Galaxy',
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
    image: 'https://via.placeholder.com/500x300/F59E0B/FFFFFF?text=Summer+Collection',
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
    image: 'https://via.placeholder.com/500x300/EF4444/FFFFFF?text=Indian+Thali',
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
    title: 'LED TV - 55 inch',
    description: 'Smart LED TV with 4K resolution and built-in streaming apps. Wall mount included.',
    price: 35999,
    salePrice: 28999,
    category: 'Electronics',
    discountType: 'Percentage Off',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
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
  },
  {
    title: 'Gym Equipment - Home Set',
    description: 'Complete home gym set with dumbbells, resistance bands, and yoga mat.',
    price: 8999,
    salePrice: 6999,
    category: 'Sports & Fitness',
    discountType: 'Fixed Amount Off',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
    area: 'Kurla',
    shopSlug: 'sports-zone'
  },
  {
    title: 'Cricket Bat - Professional',
    description: 'Professional cricket bat with premium willow wood. Perfect for serious players.',
    price: 3999,
    salePrice: 2999,
    category: 'Sports & Fitness',
    discountType: 'Percentage Off',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500',
    area: 'Kurla',
    shopSlug: 'sports-zone'
  },
  {
    title: 'Laptop - Gaming Edition',
    description: 'High-performance gaming laptop with RTX graphics and 16GB RAM. Perfect for gaming and work.',
    price: 89999,
    salePrice: 74999,
    category: 'Electronics',
    discountType: 'Flash Sale',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    area: 'Govandi',
    shopSlug: 'techzone-electronics'
  }
];

async function seedDummyData() {
  try {
    console.log('🌱 Starting to seed dummy data...');

    // Clear existing data
    await prisma.order.deleteMany();
    await prisma.deal.deleteMany();
    await prisma.shop.deleteMany();
    console.log('🧹 Cleared existing data');

    // Create shops
    const createdShops = [];
    for (const shopData of dummyShops) {
      const shop = await prisma.shop.create({
        data: shopData
      });
      createdShops.push(shop);
      console.log(`✅ Created shop: ${shop.name}`);
    }

    // Create deals
    for (const dealData of dummyDeals) {
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

    console.log('🎉 Dummy data seeding completed successfully!');
    console.log(`📊 Created ${createdShops.length} shops and ${dummyDeals.length} deals`);

  } catch (error) {
    console.error('❌ Error seeding dummy data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDummyData();
