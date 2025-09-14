import { createPrismaClient } from '../src/lib/db-connection'

async function testShopDashboard() {
  const prisma = createPrismaClient()
  
  try {
    console.log('🔍 Testing shop dashboard data...\n')
    
    // Test with an active shop
    const activeShop = await prisma.shop.findFirst({
      where: { status: 'active' },
      include: {
        deals: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            salePrice: true,
            category: true,
            discountType: true,
            isActive: true,
            viewCount: true,
            createdAt: true,
            orders: {
              select: {
                id: true,
                customerName: true,
                customerPhone: true,
                customerEmail: true,
                customerAddress: true,
                customerMessage: true,
                quantity: true,
                totalAmount: true,
                status: true,
                orderType: true,
                notes: true,
                createdAt: true,
                updatedAt: true
              }
            }
          }
        },
        orders: {
          select: {
            id: true,
            customerName: true,
            customerPhone: true,
            customerEmail: true,
            customerAddress: true,
            customerMessage: true,
            quantity: true,
            totalAmount: true,
            status: true,
            orderType: true,
            notes: true,
            createdAt: true,
            updatedAt: true,
            deal: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    })
    
    if (!activeShop) {
      console.log('❌ No active shop found')
      return
    }
    
    console.log(`✅ Found active shop: ${activeShop.name}`)
    console.log(`   ID: ${activeShop.id}`)
    console.log(`   Slug: ${activeShop.slug}`)
    console.log(`   Status: ${activeShop.status}`)
    console.log(`   Is Active: ${activeShop.isActive}`)
    console.log(`   Is Verified: ${activeShop.isVerified}`)
    console.log(`   Activated At: ${activeShop.activatedAt}`)
    console.log(`   Activated By: ${activeShop.activatedBy}`)
    console.log(`   Deals Count: ${activeShop.deals.length}`)
    console.log(`   Orders Count: ${activeShop.orders.length}`)
    console.log('')
    
    // Test with a pending shop
    const pendingShop = await prisma.shop.findFirst({
      where: { status: 'pending' },
      include: {
        deals: true,
        orders: true
      }
    })
    
    if (pendingShop) {
      console.log(`⏳ Found pending shop: ${pendingShop.name}`)
      console.log(`   ID: ${pendingShop.id}`)
      console.log(`   Slug: ${pendingShop.slug}`)
      console.log(`   Status: ${pendingShop.status}`)
      console.log(`   Is Active: ${pendingShop.isActive}`)
      console.log(`   Is Verified: ${pendingShop.isVerified}`)
      console.log('')
    }
    
    console.log('🎯 Dashboard should show:')
    console.log(`   - Active shop (${activeShop.name}): Should show full dashboard`)
    console.log(`   - Pending shop (${pendingShop?.name || 'None'}): Should show activation message`)
    
  } catch (error) {
    console.error('❌ Error testing shop dashboard:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testShopDashboard()
