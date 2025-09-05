import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding users with different roles...')

  // Create sample users with different roles
  const users = [
    {
      email: 'admin@localhub.com',
      name: 'Admin User',
      role: 'admin',
    },
    {
      email: 'editor@localhub.com',
      name: 'Content Editor',
      role: 'editor',
    },
    {
      email: 'dealer@localhub.com',
      name: 'Deal Manager',
      role: 'dealer',
    },
    {
      email: 'news@localhub.com',
      name: 'News Writer',
      role: 'news_writer',
    },
    {
      email: 'user@localhub.com',
      name: 'Regular User',
      role: 'user',
    },
  ]

  for (const userData of users) {
    try {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: { role: userData.role },
        create: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          emailVerified: new Date(),
        },
      })
      console.log(`✅ Created/Updated user: ${user.name} (${user.role})`)
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error)
    }
  }

  console.log('🎉 User seeding completed!')
  console.log('\n📧 Test Login Credentials:')
  console.log('Admin: admin@localhub.com')
  console.log('Editor: editor@localhub.com')
  console.log('Deal Manager: dealer@localhub.com')
  console.log('News Writer: news@localhub.com')
  console.log('Regular User: user@localhub.com')
  console.log('\n💡 Note: Use magic link authentication to sign in with these emails')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
