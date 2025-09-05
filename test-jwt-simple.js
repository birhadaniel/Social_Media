// Simple JWT test
const jwt = require('jsonwebtoken');

// Test JWT secret
const JWT_SECRET = "79y00BQEvx9ACgfZN12iPnSG9IE/EYBKJ4dbOqheYDc=";

try {
  console.log('Testing JWT functionality...');
  
  // Create a test token
  const testPayload = { userId: 1 };
  const token = jwt.sign(testPayload, JWT_SECRET, { expiresIn: '1h' });
  console.log('✅ JWT token created:', token.substring(0, 50) + '...');
  
  // Verify the token
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✅ JWT token verified:', decoded);
  
} catch (error) {
  console.error('❌ JWT error:', error);
}
