// Simple database connection test
const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test user query
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
    
    // Test specific user query
    const user = await prisma.user.findUnique({
      where: { id: 1 },
      select: {
        id: true,
        username: true,
        email: true,
      }
    });
    
    if (user) {
      console.log('✅ User with ID 1 found:', user);
    } else {
      console.log('❌ User with ID 1 not found');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
