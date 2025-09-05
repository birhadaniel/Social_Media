@echo off
echo Setting up environment variables...

if not exist .env.local (
    echo Creating .env.local file...
    echo JWT_SECRET=your_super_secret_jwt_key_here_12345 > .env.local
    echo DATABASE_URL="postgresql://neondb_owner:npg_bceDPfrJBj37@ep-withered-fog-ae54rupf-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" >> .env.local
    echo.
    echo ✅ .env.local file created successfully!
    echo ⚠️  Please update the values with your actual credentials
) else (
    echo ✅ .env.local file already exists
)

echo.
echo 📋 Next steps:
echo 1. Update .env.local with your actual JWT_SECRET and DATABASE_URL
echo 2. Restart your development server
echo 3. Test the profile functionality
echo.
pause
