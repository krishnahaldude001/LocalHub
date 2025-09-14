import { createPrismaClient } from '../src/lib/db-connection';

const prisma = createPrismaClient();

async function checkUsers() {
  try {
    console.log('Checking all users in database...\n');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (users.length === 0) {
      console.log('❌ No users found in database!');
      return;
    }

    console.log(`✅ Found ${users.length} users:\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'No name'}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Verified: ${user.emailVerified ? 'Yes' : 'No'}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // Check for admin user specifically
    const adminUser = users.find(user => user.email === 'admin@localhub.com');
    if (adminUser) {
      console.log('✅ Admin user found!');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Verified: ${adminUser.emailVerified ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Admin user (admin@localhub.com) not found!');
    }

    // Check for shop owner user
    const shopOwner = users.find(user => user.email === '+91 98765 43210');
    if (shopOwner) {
      console.log('\n✅ Shop owner user found!');
      console.log(`   Email: ${shopOwner.email}`);
      console.log(`   Role: ${shopOwner.role}`);
      console.log(`   Verified: ${shopOwner.emailVerified ? 'Yes' : 'No'}`);
    } else {
      console.log('\n❌ Shop owner user (+91 98765 43210) not found!');
    }

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
