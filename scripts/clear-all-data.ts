import { createPrismaClient } from '../src/lib/db-connection'

async function clearAllData() {
  const prisma = createPrismaClient()
  
  try {
    console.log('🧹 Starting to clear all data...')
    
    // Clear all data in the correct order (respecting foreign key constraints)
    console.log('📊 Clearing analytics data...')
    await prisma.click.deleteMany()
    await prisma.view.deleteMany()
    
    console.log('📦 Clearing orders...')
    await prisma.order.deleteMany()
    
    console.log('🛍️ Clearing deals...')
    await prisma.deal.deleteMany()
    
    console.log('🏪 Clearing shops...')
    await prisma.shop.deleteMany()
    
    console.log('📰 Clearing news posts...')
    await prisma.post.deleteMany()
    
    console.log('👥 Clearing users (except admin)...')
    await prisma.user.deleteMany({
      where: {
        role: {
          not: 'admin'
        }
      }
    })
    
    console.log('🏢 Clearing platforms...')
    await prisma.platform.deleteMany()
    
    console.log('📞 Clearing contact info...')
    await prisma.contactInfo.deleteMany()
    
    console.log('✅ All data cleared successfully!')
    console.log('🎉 Your website is now clean and ready!')
    
  } catch (error) {
    console.error('❌ Error clearing data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearAllData()
