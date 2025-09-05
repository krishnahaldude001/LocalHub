import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive database seeding...')
  
  try {
    // Seed platforms
    console.log('\n📱 Seeding platforms...')
    const { execSync } = require('child_process')
    execSync('npx tsx prisma/seed-platforms.ts', { stdio: 'inherit' })
    
    // Seed users with passwords
    console.log('\n👥 Seeding users...')
    execSync('npx tsx prisma/seed-users-with-passwords.ts', { stdio: 'inherit' })
    
    // Seed news articles
    console.log('\n📰 Seeding news articles...')
    execSync('npx tsx prisma/seed-news.ts', { stdio: 'inherit' })
    
    // Seed additional news
    console.log('\n📰 Seeding additional news...')
    execSync('npx tsx prisma/seed-additional-news.ts', { stdio: 'inherit' })
    
    // Seed deals
    console.log('\n🛍️ Seeding deals...')
    execSync('npx tsx prisma/seed-deals.ts', { stdio: 'inherit' })
    
    console.log('\n🎉 All seeding completed successfully!')
    
    // Show summary
    const [platformCount, userCount, newsCount, dealCount] = await Promise.all([
      prisma.platform.count(),
      prisma.user.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.deal.count()
    ])
    
    console.log('\n📊 Database Summary:')
    console.log(`- Platforms: ${platformCount}`)
    console.log(`- Users: ${userCount}`)
    console.log(`- News Articles: ${newsCount}`)
    console.log(`- Deals: ${dealCount}`)
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
