const fetch = require('node-fetch')

async function testUserCreationAPI() {
  try {
    console.log('=== Testing User Creation API ===\n')
    
    // Test data
    const testUser = {
      name: 'Test User API',
      email: 'testapi@localhub.space',
      password: 'testpassword123',
      role: 'user'
    }
    
    console.log('1. Testing POST /api/admin/users...')
    console.log('Request data:', testUser)
    
    const response = await fetch('http://localhost:3000/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    })
    
    console.log(`Response status: ${response.status}`)
    console.log(`Response ok: ${response.ok}`)
    
    const result = await response.json()
    console.log('Response data:', result)
    
    if (response.ok) {
      console.log('✅ User creation API is working!')
      console.log('Created user:', result.user)
    } else {
      console.log('❌ User creation failed:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message)
    console.log('Make sure the development server is running on http://localhost:3000')
  }
}

testUserCreationAPI()
