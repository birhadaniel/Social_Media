const fs = require('fs');
const path = require('path');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('Creating .env.local file...');
  
  const envContent = `# JWT Secret for authentication
JWT_SECRET=your_super_secret_jwt_key_here_12345

# Database URL (replace with your actual Neon connection string)
DATABASE_URL="postgresql://your_username:your_password@your_host/your_database"

# Next.js configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('⚠️  Please update the values with your actual credentials');
} else {
  console.log('✅ .env.local file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Update .env.local with your actual JWT_SECRET and DATABASE_URL');
console.log('2. Restart your development server');
console.log('3. Test the authentication flow');
