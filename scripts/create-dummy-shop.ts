import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createDummyShop() {
  try {
    console.log('Creating dummy shop with credentials...');

    // Check if shop already exists
    const existingShop = await prisma.shop.findFirst({
      where: { name: 'TechMart Electronics' }
    });

    if (existingShop) {
      console.log('Dummy shop already exists!');
      console.log('Shop Details:');
      console.log('- Name:', existingShop.name);
      console.log('- Email:', existingShop.email);
      console.log('- Phone:', existingShop.phone);
      console.log('- Slug:', existingShop.slug);
      
      // Find the user account
      const user = await prisma.user.findUnique({
        where: { email: existingShop.phone } // Phone number is used as email
      });
      
      if (user) {
        console.log('\nLogin Credentials:');
        console.log('- Username (Mobile):', user.email);
        console.log('- Password: shop123');
        console.log('- Login URL: http://localhost:3000/auth/signin');
        console.log('- Shop Dashboard: http://localhost:3000/shop/' + existingShop.slug + '/dashboard');
        console.log('- My Shops: http://localhost:3000/my-shops');
      }
      
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('shop123', 10);

    // Create user account and shop in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user account
      const user = await tx.user.create({
        data: {
          name: 'Rajesh Kumar',
          email: '+91 98765 43210', // Mobile number as email for login
          password: hashedPassword,
          role: 'user',
          emailVerified: new Date()
        }
      });

      // Create shop
      const shop = await tx.shop.create({
        data: {
          name: 'TechMart Electronics',
          slug: 'techmart-electronics',
          description: 'Your one-stop shop for all electronic gadgets and accessories. We offer the latest smartphones, laptops, and home appliances at competitive prices.',
          ownerName: 'Rajesh Kumar',
          email: 'rajesh@techmart.com',
          phone: '+91 98765 43210',
          whatsapp: '+91 98765 43210',
          address: 'Shop No. 15, Govandi Station Road, Govandi East, Mumbai - 400043',
          area: 'Govandi',
          category: 'Electronics',
          businessHours: '10:00 AM - 10:00 PM (Mon-Sun)',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500',
          isVerified: true,
          isActive: true,
          userId: user.id
        }
      });

      return { user, shop };
    });

    console.log('✅ Dummy shop created successfully!');
    console.log('\n📋 Shop Details:');
    console.log('- Name:', result.shop.name);
    console.log('- Owner:', result.shop.ownerName);
    console.log('- Email:', result.shop.email);
    console.log('- Phone:', result.shop.phone);
    console.log('- Address:', result.shop.address);
    console.log('- Area:', result.shop.area);
    console.log('- Category:', result.shop.category);
    console.log('- Slug:', result.shop.slug);

    console.log('\n🔐 Login Credentials:');
    console.log('- Username (Mobile): +91 98765 43210');
    console.log('- Password: shop123');
    console.log('- Role: user (shop owner)');

    console.log('\n🌐 URLs:');
    console.log('- Login: http://localhost:3000/auth/signin');
    console.log('- Shop Page: http://localhost:3000/shop/' + result.shop.slug);
    console.log('- Shop Dashboard: http://localhost:3000/shop/' + result.shop.slug + '/dashboard');
    console.log('- My Shops: http://localhost:3000/my-shops');

    console.log('\n📱 How to Test:');
    console.log('1. Go to http://localhost:3000/auth/signin');
    console.log('2. Use Username: +91 98765 43210');
    console.log('3. Use Password: shop123');
    console.log('4. You will be redirected to /my-shops');
    console.log('5. Click "Dashboard" to access shop management');

  } catch (error) {
    console.error('❌ Error creating dummy shop:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDummyShop();
