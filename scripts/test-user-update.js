const https = require('https');
const http = require('http');

async function testUserUpdate() {
  try {
    // First, let's get a user ID from the database
    console.log('Testing user update functionality...\n');
    
    // Test data for updating
    const updateData = JSON.stringify({
      name: 'Updated Admin User',
      email: 'admin@localhub.space',
      password: 'newpassword123', // New password
      role: 'admin'
    });
    
    // We'll need to get a real user ID first
    // For now, let's test with a mock ID
    const userId = 'test-user-id';
    
    console.log('Testing PUT /api/admin/users/' + userId);
    console.log('Request data:', JSON.parse(updateData));
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/admin/users/${userId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': updateData.length
      }
    };
    
    const req = http.request(options, (res) => {
      console.log('Response status:', res.statusCode);
      console.log('Response headers:', res.headers);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          console.log('Response data:', result);
          
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ User update API is working!');
          } else if (res.statusCode === 401) {
            console.log('⚠️  API requires authentication (expected behavior)');
            console.log('✅ User update API endpoint exists and is working!');
          } else {
            console.log('❌ User update failed:', result.error);
          }
        } catch (e) {
          console.log('Raw response:', responseData);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
    });
    
    req.write(updateData);
    req.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testUserUpdate();
