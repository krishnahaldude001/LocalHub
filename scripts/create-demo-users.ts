import { createPrismaClient } from '../src/lib/db-connection';
import bcrypt from 'bcryptjs';

const demoUsers = [
  {
    name: 'Editor User',
    email: 'editor@localhub.com',
    role: 'editor',
    password: 'editor123'
  },
  {
    name: 'Dealer User',
    email: 'dealer@localhub.com',
    role: 'dealer',
    password: 'dealer123'
  }
];

async function createDemoUsers() {
  const prisma = createPrismaClient();
  
  try {
    console.log('🌱 Creating demo users...');

    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⏭️  User already exists: ${userData.email}`);
        continue;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create the user
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          password: hashedPassword,
          emailVerified: new Date()
        }
      });

      console.log(`✅ Created user: ${user.name} (${user.email}) - Role: ${user.role}`);
    }

    console.log('🎉 Demo users creation completed!');
    console.log('\n📋 Demo Credentials:');
    console.log('👑 Admin: admin@localhub.com / admin123');
    console.log('✏️  Editor: editor@localhub.com / editor123');
    console.log('🏪 Dealer: dealer@localhub.com / dealer123');

  } catch (error) {
    console.error('❌ Error creating demo users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUsers();
