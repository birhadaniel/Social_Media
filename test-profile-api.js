// Test the profile API
const fetch = require('node-fetch');

async function testProfileAPI() {
  console.log('Testing Profile API...');
  
  try {
    // Test the test-profile endpoint first
    const testResponse = await fetch('http://localhost:3000/api/test-profile');
    const testData = await testResponse.json();
    console.log('✅ Test Profile API Response:', testData);
    
    // Test the users API (this will fail without auth, but we can see the structure)
    const usersResponse = await fetch('http://localhost:3000/api/users/1');
    console.log('Users API Status:', usersResponse.status);
    
    if (usersResponse.status === 401) {
      console.log('✅ Users API is properly protected (401 Unauthorized)');
    } else {
      const usersData = await usersResponse.json();
      console.log('Users API Response:', usersData);
    }
    
  } catch (error) {
    console.log('❌ Error testing APIs:', error.message);
  }
}

testProfileAPI();
