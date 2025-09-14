import { createPrismaClient } from '../src/lib/db-connection'

async function checkShopStatus() {
  const prisma = createPrismaClient()
  
  try {
    console.log('🔍 Checking shop statuses...\n')
    
    const shops = await prisma.shop.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        isActive: true,
        isVerified: true,
        activatedAt: true,
        activatedBy: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    if (shops.length === 0) {
      console.log('❌ No shops found in database')
      return
    }
    
    console.log(`📊 Found ${shops.length} shops:\n`)
    
    shops.forEach((shop, index) => {
      console.log(`${index + 1}. ${shop.name}`)
      console.log(`   ID: ${shop.id}`)
      console.log(`   Slug: ${shop.slug}`)
      console.log(`   Status: ${shop.status}`)
      console.log(`   Is Active: ${shop.isActive}`)
      console.log(`   Is Verified: ${shop.isVerified}`)
      console.log(`   Activated At: ${shop.activatedAt || 'Not activated'}`)
      console.log(`   Activated By: ${shop.activatedBy || 'Not activated'}`)
      console.log(`   Created: ${shop.createdAt.toISOString()}`)
      console.log('')
    })
    
    // Check for pending shops
    const pendingShops = shops.filter(shop => shop.status === 'pending')
    const activeShops = shops.filter(shop => shop.status === 'active')
    
    console.log(`📈 Summary:`)
    console.log(`   Total Shops: ${shops.length}`)
    console.log(`   Pending: ${pendingShops.length}`)
    console.log(`   Active: ${activeShops.length}`)
    
  } catch (error) {
    console.error('❌ Error checking shop status:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkShopStatus()
