import { createPrismaClient } from '../src/lib/db-connection';

async function checkAndCreateAdmin() {
  const prisma = createPrismaClient();
  
  try {
    console.log('🔍 Checking for existing users...');

    // Check if any users exist
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users in database`);

    if (users.length === 0) {
      console.log('❌ No users found. Creating admin user...');
      
      // Create admin user
      const adminUser = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@localhub.com',
          role: 'admin',
          password: 'admin123', // This should be hashed in production
          emailVerified: new Date()
        }
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@localhub.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: admin');
      
    } else {
      console.log('👥 Existing users:');
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      });
      
      // Check if admin exists
      const adminExists = users.find(user => user.email === 'admin@localhub.com');
      if (!adminExists) {
        console.log('❌ Admin user not found. Creating admin user...');
        
        const adminUser = await prisma.user.create({
          data: {
            name: 'Admin User',
            email: 'admin@localhub.com',
            role: 'admin',
            password: 'admin123',
            emailVerified: new Date()
          }
        });
        
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@localhub.com');
        console.log('🔑 Password: admin123');
      } else {
        console.log('✅ Admin user already exists!');
        console.log('📧 Email: admin@localhub.com');
        console.log('🔑 Password: admin123');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCreateAdmin();
