import { createPrismaClient } from '../src/lib/db-connection';

const additionalShops = [
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

const additionalDeals = [
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
  }
];

async function addMoreData() {
  const prisma = createPrismaClient();
  
  try {
    console.log('🌱 Adding more dummy data...');

    // Create additional shops
    const createdShops = [];
    for (const shopData of additionalShops) {
      const shop = await prisma.shop.create({
        data: shopData
      });
      createdShops.push(shop);
      console.log(`✅ Created shop: ${shop.name}`);
    }

    // Create additional deals
    for (const dealData of additionalDeals) {
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

    console.log('🎉 Additional data addition completed!');
    console.log(`📊 Created ${createdShops.length} more shops and ${additionalDeals.length} more deals`);

  } catch (error) {
    console.error('❌ Error adding more data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreData();
