// Simple test to check if the API is working
const http = require('http');

function testAPI() {
  console.log('Testing API endpoints...');
  
  // Test the test-profile endpoint
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/test-profile',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    console.log(`Test Profile API Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('Test Profile API Response:', jsonData);
      } catch (e) {
        console.log('Test Profile API Raw Response:', data);
      }
    });
  });
  
  req.on('error', (e) => {
    console.error(`Test Profile API Error: ${e.message}`);
  });
  
  req.end();
}

testAPI();
