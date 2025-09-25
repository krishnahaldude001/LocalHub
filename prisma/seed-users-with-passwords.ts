import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding users with passwords...')

  // Hash passwords
  const hashedPasswords = {
    admin: await bcrypt.hash('admin123', 12),
    editor: await bcrypt.hash('editor123', 12),
    dealer: await bcrypt.hash('dealer123', 12),
    news: await bcrypt.hash('news123', 12),
    user: await bcrypt.hash('user123', 12),
  }

  // Create sample users with different roles and passwords
  const users = [
    {
      email: 'admin@localhub.space',
      name: 'Admin User',
      role: 'admin',
      password: hashedPasswords.admin,
    },
    {
      email: 'editor@localhub.space',
      name: 'Content Editor',
      role: 'editor',
      password: hashedPasswords.editor,
    },
    {
      email: 'dealer@localhub.space',
      name: 'Deal Manager',
      role: 'dealer',
      password: hashedPasswords.dealer,
    },
    {
      email: 'news@localhub.space',
      name: 'News Writer',
      role: 'news_writer',
      password: hashedPasswords.news,
    },
    {
      email: 'user@localhub.space',
      name: 'Regular User',
      role: 'user',
      password: hashedPasswords.user,
    },
  ]

  for (const userData of users) {
    try {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: { 
          role: userData.role,
          password: userData.password,
        },
        create: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          password: userData.password,
          emailVerified: new Date(),
        },
      })
      console.log(`✅ Created/Updated user: ${user.name} (${user.role})`)
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error)
    }
  }

  console.log('🎉 User seeding with passwords completed!')
  console.log('\n🔐 Login Credentials:')
  console.log('Admin: admin@localhub.space / admin123')
  console.log('Editor: editor@localhub.space / editor123')
  console.log('Deal Manager: dealer@localhub.space / dealer123')
  console.log('News Writer: news@localhub.space / news123')
  console.log('Regular User: user@localhub.space / user123')
  console.log('\n💡 You can now use username/password authentication!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
