import { createPrismaClient } from '../src/lib/db-connection'
import bcrypt from 'bcryptjs'

async function checkShopCredentials() {
  const prisma = createPrismaClient()
  
  try {
    console.log('🔍 Checking shop owner credentials...\n')
    
    // Check if there are any users with shop owner role
    const shopOwners = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'dealer' },
          { email: { contains: 'shop' } },
          { name: { contains: 'shop' } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        createdAt: true
      }
    })
    
    console.log(`📊 Found ${shopOwners.length} potential shop owners:\n`)
    
    shopOwners.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Has Password: ${user.password ? 'Yes' : 'No'}`)
      console.log(`   Created: ${user.createdAt.toISOString()}`)
      console.log('')
    })
    
    // Check for the specific demo credentials
    const demoEmail = '+91 98765 43210'
    const demoUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: demoEmail },
          { email: '9876543210' },
          { email: '+919876543210' }
        ]
      }
    })
    
    if (demoUser) {
      console.log(`✅ Found demo user: ${demoUser.name}`)
      console.log(`   Email: ${demoUser.email}`)
      console.log(`   Role: ${demoUser.role}`)
      console.log(`   Has Password: ${demoUser.password ? 'Yes' : 'No'}`)
      
      // Test password
      if (demoUser.password) {
        const isValid = await bcrypt.compare('shop123', demoUser.password)
        console.log(`   Password 'shop123' is valid: ${isValid}`)
      }
    } else {
      console.log('❌ Demo user not found with mobile number +91 98765 43210')
    }
    
    // Check shops and their associated users
    const shops = await prisma.shop.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })
    
    console.log(`\n🏪 Shops with associated users:`)
    shops.forEach((shop, index) => {
      console.log(`${index + 1}. ${shop.name}`)
      console.log(`   Owner: ${shop.ownerName}`)
      console.log(`   Email: ${shop.email}`)
      console.log(`   Phone: ${shop.phone}`)
      if (shop.user) {
        console.log(`   User Account: ${shop.user.name} (${shop.user.email})`)
        console.log(`   User Role: ${shop.user.role}`)
      } else {
        console.log(`   User Account: Not linked`)
      }
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Error checking shop credentials:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkShopCredentials()
