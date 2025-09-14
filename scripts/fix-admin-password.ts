import { createPrismaClient } from '../src/lib/db-connection';
import bcrypt from 'bcryptjs';

async function fixAdminPassword() {
  const prisma = createPrismaClient();
  
  try {
    console.log('🔧 Fixing admin password...');

    // Find the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@localhub.com' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('👤 Found admin user:', adminUser.email);

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    console.log('🔐 Password hashed successfully');

    // Update the user with hashed password
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { password: hashedPassword }
    });

    console.log('✅ Admin password updated successfully!');
    console.log('📧 Email: admin@localhub.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');

  } catch (error) {
    console.error('❌ Error fixing admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminPassword();
