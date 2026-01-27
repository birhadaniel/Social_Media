// Test JWT functionality
const jwt = require('jsonwebtoken');

// Test JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

console.log('Testing JWT functionality...');
console.log('JWT_SECRET:', JWT_SECRET ? 'SET' : 'NOT SET');

try {
  // Test token generation
  const payload = { userId: 1 };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  console.log('✅ Token generated successfully');
  console.log('Token length:', token.length);
  
  // Test token verification
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✅ Token verified successfully');
  console.log('Decoded payload:', decoded);
  
} catch (error) {
  console.log('❌ JWT error:', error.message);
}
