// Simple script to add dummy data via API calls

const shops = [
  {
    name: 'TechZone Electronics',
    description: 'Your one-stop shop for all electronics and gadgets. We offer the latest smartphones, laptops, and home appliances with competitive prices.',
    ownerName: 'Rajesh Kumar',
    email: 'rajesh@techzone.com',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    address: 'Shop No. 15, Govandi East, Mumbai - 400088',
    area: 'Govandi',
    category: 'Electronics',
    businessHours: 'Mon-Sat: 10 AM - 9 PM, Sun: 11 AM - 8 PM',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500'
  },
  {
    name: 'Fashion Hub',
    description: 'Trendy clothing and accessories for men, women, and kids. Latest fashion trends at affordable prices.',
    ownerName: 'Priya Sharma',
    email: 'priya@fashionhub.com',
    phone: '+91 98765 43211',
    whatsapp: '+91 98765 43211',
    address: 'Ground Floor, Shivaji Nagar Market, Mumbai - 400043',
    area: 'Shivaji Nagar',
    category: 'Clothing & Fashion',
    businessHours: 'Mon-Sun: 9 AM - 10 PM',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'
  },
  {
    name: 'Spice Garden Restaurant',
    description: 'Authentic Indian cuisine with a modern twist. Fresh ingredients and traditional recipes.',
    ownerName: 'Amit Patel',
    email: 'amit@spicegarden.com',
    phone: '+91 98765 43212',
    whatsapp: '+91 98765 43212',
    address: 'Near Baiganwadi Station, Mumbai - 400043',
    area: 'Baiganwadi',
    category: 'Food & Beverages',
    businessHours: 'Mon-Sun: 7 AM - 11 PM',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'
  },
  {
    name: 'Home Decor Plus',
    description: 'Beautiful home decoration items, furniture, and interior design solutions.',
    ownerName: 'Sunita Mehta',
    email: 'sunita@homedecor.com',
    phone: '+91 98765 43213',
    whatsapp: '+91 98765 43213',
    address: 'Shop No. 8, Mankhurd Market, Mumbai - 400088',
    area: 'Mankhurd',
    category: 'Home & Garden',
    businessHours: 'Mon-Sat: 10 AM - 8 PM, Sun: 11 AM - 7 PM',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'
  },
  {
    name: 'Beauty World',
    description: 'Premium beauty products, cosmetics, and skincare items from top brands.',
    ownerName: 'Kavita Singh',
    email: 'kavita@beautyworld.com',
    phone: '+91 98765 43214',
    whatsapp: '+91 98765 43214',
    address: 'Chembur East, Mumbai - 400071',
    area: 'Chembur',
    category: 'Health & Beauty',
    businessHours: 'Mon-Sun: 9 AM - 9 PM',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'
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

async function addData() {
  const baseUrl = 'http://localhost:3000';
  const createdShops = [];

  console.log('🌱 Adding shops...');
  
  // Add shops
  for (const shop of shops) {
    try {
      const response = await fetch(`${baseUrl}/api/shops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shop),
      });

      if (response.ok) {
        const createdShop = await response.json();
        createdShops.push(createdShop);
        console.log(`✅ Created shop: ${createdShop.name}`);
      } else {
        const error = await response.json();
        console.log(`❌ Error creating shop ${shop.name}:`, error.message);
      }
    } catch (error) {
      console.log(`❌ Error creating shop ${shop.name}:`, error.message);
    }
  }

  console.log('\n🌱 Adding deals...');
  
  // Add deals
  for (const deal of deals) {
    try {
      const response = await fetch(`${baseUrl}/api/deals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deal),
      });

      if (response.ok) {
        const createdDeal = await response.json();
        console.log(`✅ Created deal: ${createdDeal.title}`);
      } else {
        const error = await response.json();
        console.log(`❌ Error creating deal ${deal.title}:`, error.message);
      }
    } catch (error) {
      console.log(`❌ Error creating deal ${deal.title}:`, error.message);
    }
  }

  console.log('\n🎉 Data addition completed!');
  console.log(`📊 Created ${createdShops.length} shops and ${deals.length} deals`);
}

// Wait for server to be ready
setTimeout(() => {
  addData();
}, 3000);
