import { createPrismaClient } from '../src/lib/db-connection'
import bcrypt from 'bcryptjs'

async function testLogin() {
  const prisma = createPrismaClient()
  
  try {
    console.log('🔍 Testing login functionality...\n')
    
    // Test the demo shop owner credentials
    const testCredentials = {
      email: '+91 98765 43210',
      password: 'shop123'
    }
    
    console.log(`Testing credentials: ${testCredentials.email} / ${testCredentials.password}`)
    
    // Try to find user by exact email
    let user = await prisma.user.findUnique({
      where: { email: testCredentials.email }
    })
    
    console.log(`1. Exact email match: ${user ? 'Found' : 'Not found'}`)
    if (user) {
      console.log(`   User: ${user.name} (${user.email})`)
      console.log(`   Role: ${user.role}`)
    }
    
    // If not found, try mobile number variations
    if (!user) {
      const mobileVariations = [
        testCredentials.email,
        testCredentials.email.replace(/\s/g, ''), // Remove spaces
        testCredentials.email.replace(/\+/g, ''), // Remove +
        testCredentials.email.replace(/\s/g, '').replace(/\+/g, ''), // Remove both
      ]

      console.log(`2. Trying mobile variations:`)
      for (const variation of mobileVariations) {
        console.log(`   Trying: "${variation}"`)
        user = await prisma.user.findFirst({
          where: { 
            email: {
              contains: variation
            }
          }
        })
        if (user) {
          console.log(`   ✅ Found user: ${user.name} (${user.email})`)
          console.log(`   Role: ${user.role}`)
          break
        }
      }
    }
    
    if (!user) {
      console.log('❌ User not found with any variation')
      return
    }
    
    if (!user.password) {
      console.log('❌ User has no password set')
      return
    }
    
    // Test password
    const isPasswordValid = await bcrypt.compare(testCredentials.password, user.password)
    console.log(`3. Password validation: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`)
    
    if (isPasswordValid) {
      console.log('\n🎉 Login should work!')
      console.log(`   User: ${user.name}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${user.role}`)
      
      // Check if user has shops
      const shops = await prisma.shop.findMany({
        where: {
          OR: [
            { userId: user.id },
            { email: user.email },
            { phone: user.email }
          ]
        }
      })
      
      console.log(`   Associated shops: ${shops.length}`)
      shops.forEach(shop => {
        console.log(`     - ${shop.name} (${shop.status})`)
      })
    } else {
      console.log('\n❌ Login will fail - invalid password')
    }
    
  } catch (error) {
    console.error('❌ Error testing login:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin()
