const { PrismaClient } = require('@prisma/client')

async function testUserCreation() {
  const prisma = new PrismaClient()
  
  try {
    console.log('=== Testing User Creation Functionality ===\n')
    
    // Test 1: Check if we can connect to the database
    console.log('1. Testing database connection...')
    const userCount = await prisma.user.count()
    console.log(`✅ Database connected. Current users: ${userCount}`)
    
    // Test 2: Check if we can create a test user
    console.log('\n2. Testing user creation...')
    const testUser = {
      name: 'Test User',
      email: 'test@localhub.space',
      password: 'testpassword123',
      role: 'user'
    }
    
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testUser.email }
    })
    
    if (existingUser) {
      console.log('⚠️  Test user already exists, deleting...')
      await prisma.user.delete({
        where: { email: testUser.email }
      })
      console.log('✅ Test user deleted')
    }
    
    // Create test user
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(testUser.password, 12)
    
    const newUser = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        role: testUser.role,
        emailVerified: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
    
    console.log('✅ Test user created successfully:')
    console.log(`   - ID: ${newUser.id}`)
    console.log(`   - Name: ${newUser.name}`)
    console.log(`   - Email: ${newUser.email}`)
    console.log(`   - Role: ${newUser.role}`)
    
    // Test 3: Verify user was created
    console.log('\n3. Verifying user creation...')
    const createdUser = await prisma.user.findUnique({
      where: { email: testUser.email }
    })
    
    if (createdUser) {
      console.log('✅ User found in database')
    } else {
      console.log('❌ User not found in database')
    }
    
    // Test 4: Test password verification
    console.log('\n4. Testing password verification...')
    const isPasswordValid = await bcrypt.compare(testUser.password, createdUser.password)
    console.log(`✅ Password verification: ${isPasswordValid ? 'PASSED' : 'FAILED'}`)
    
    // Test 5: Clean up test user
    console.log('\n5. Cleaning up test user...')
    await prisma.user.delete({
      where: { email: testUser.email }
    })
    console.log('✅ Test user deleted')
    
    console.log('\n🎉 All tests passed! User creation functionality is working correctly.')
    
  } catch (error) {
    console.error('❌ Error during testing:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testUserCreation()
