import { createPrismaClient } from '../src/lib/db-connection'

async function testShopAPI() {
  const prisma = createPrismaClient()
  
  try {
    console.log('🔍 Testing shop API data...\n')
    
    // Test with an active shop
    const activeShop = await prisma.shop.findFirst({
      where: { status: 'active' }
    })
    
    if (!activeShop) {
      console.log('❌ No active shop found')
      return
    }
    
    console.log(`✅ Testing with active shop: ${activeShop.name}`)
    console.log(`   Slug: ${activeShop.slug}`)
    console.log(`   Status: ${activeShop.status}`)
    console.log('')
    
    // Simulate the API call
    const shop = await prisma.shop.findUnique({
      where: { slug: activeShop.slug },
      include: {
        deals: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          include: {
            orders: {
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            deal: true
          }
        }
      }
    })
    
    if (!shop) {
      console.log('❌ Shop not found via slug')
      return
    }
    
    console.log(`✅ Shop found via API simulation:`)
    console.log(`   Name: ${shop.name}`)
    console.log(`   Status: ${shop.status}`)
    console.log(`   Is Active: ${shop.isActive}`)
    console.log(`   Is Verified: ${shop.isVerified}`)
    console.log(`   Deals Count: ${shop.deals.length}`)
    console.log(`   Orders Count: ${shop.orders.length}`)
    console.log('')
    
    // Test dashboard logic
    console.log('🎯 Dashboard Logic Test:')
    if (shop.status !== 'active') {
      console.log('   ❌ Should show activation message (status is not active)')
    } else {
      console.log('   ✅ Should show full dashboard (status is active)')
    }
    
    // Test with a pending shop
    const pendingShop = await prisma.shop.findFirst({
      where: { status: 'pending' }
    })
    
    if (pendingShop) {
      console.log(`\n⏳ Testing with pending shop: ${pendingShop.name}`)
      console.log(`   Slug: ${pendingShop.slug}`)
      console.log(`   Status: ${pendingShop.status}`)
      
      if (pendingShop.status !== 'active') {
        console.log('   ✅ Should show activation message (status is pending)')
      } else {
        console.log('   ❌ Should show full dashboard (status is active)')
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing shop API:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testShopAPI()
