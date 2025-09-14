import { createPrismaClient } from '../src/lib/db-connection';
import bcrypt from 'bcryptjs';

const prisma = createPrismaClient();

async function testAuth() {
  try {
    console.log('Testing authentication for different users...\n');

    // Test admin user
    console.log('1. Testing Admin User:');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@localhub.com' }
    });

    if (adminUser) {
      console.log('   ✅ Admin user found');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Has password: ${adminUser.password ? 'Yes' : 'No'}`);
      
      if (adminUser.password) {
        const isPasswordValid = await bcrypt.compare('admin123', adminUser.password);
        console.log(`   Password 'admin123' valid: ${isPasswordValid ? '✅ Yes' : '❌ No'}`);
      }
    } else {
      console.log('   ❌ Admin user not found');
    }

    console.log('\n2. Testing Shop Owner User:');
    const shopOwner = await prisma.user.findUnique({
      where: { email: '+91 98765 43210' }
    });

    if (shopOwner) {
      console.log('   ✅ Shop owner found');
      console.log(`   Email: ${shopOwner.email}`);
      console.log(`   Role: ${shopOwner.role}`);
      console.log(`   Has password: ${shopOwner.password ? 'Yes' : 'No'}`);
      
      if (shopOwner.password) {
        const isPasswordValid = await bcrypt.compare('shop123', shopOwner.password);
        console.log(`   Password 'shop123' valid: ${isPasswordValid ? '✅ Yes' : '❌ No'}`);
      }
    } else {
      console.log('   ❌ Shop owner not found');
    }

    console.log('\n3. Testing Editor User:');
    const editorUser = await prisma.user.findUnique({
      where: { email: 'editor@localhub.com' }
    });

    if (editorUser) {
      console.log('   ✅ Editor user found');
      console.log(`   Email: ${editorUser.email}`);
      console.log(`   Role: ${editorUser.role}`);
      console.log(`   Has password: ${editorUser.password ? 'Yes' : 'No'}`);
      
      if (editorUser.password) {
        const isPasswordValid = await bcrypt.compare('editor123', editorUser.password);
        console.log(`   Password 'editor123' valid: ${isPasswordValid ? '✅ Yes' : '❌ No'}`);
      }
    } else {
      console.log('   ❌ Editor user not found');
    }

    console.log('\n4. Testing Dealer User:');
    const dealerUser = await prisma.user.findUnique({
      where: { email: 'dealer@localhub.com' }
    });

    if (dealerUser) {
      console.log('   ✅ Dealer user found');
      console.log(`   Email: ${dealerUser.email}`);
      console.log(`   Role: ${dealerUser.role}`);
      console.log(`   Has password: ${dealerUser.password ? 'Yes' : 'No'}`);
      
      if (dealerUser.password) {
        const isPasswordValid = await bcrypt.compare('dealer123', dealerUser.password);
        console.log(`   Password 'dealer123' valid: ${isPasswordValid ? '✅ Yes' : '❌ No'}`);
      }
    } else {
      console.log('   ❌ Dealer user not found');
    }

  } catch (error) {
    console.error('❌ Error testing authentication:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
