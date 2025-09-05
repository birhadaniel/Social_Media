# Debug Guide for Profile Issues

## Current Issues:

1. "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
2. "User not found" error
3. Prisma field name issues (followingId vs followedId)

## Step-by-Step Debugging:

### 1. Check Environment Variables

```bash
# Create .env.local file with:
JWT_SECRET=your_super_secret_jwt_key_here_12345
DATABASE_URL="your_neon_connection_string"
```

### 2. Test JWT Functionality

```bash
node test-jwt.js
```

### 3. Test Profile API

Visit: http://localhost:3000/api/test-profile

### 4. Check Browser Console

- Open DevTools → Console
- Look for error messages
- Check Network tab for API responses

### 5. Check Server Console

- Look for middleware logs
- Check profile API logs
- Verify JWT verification

## Common Fixes:

### Fix 1: Environment Variables

Create `.env.local` file:

```
JWT_SECRET=your_secret_key_here
DATABASE_URL="postgresql://user:pass@host/db"
```

### Fix 2: Restart Development Server

```bash
npm run dev
```

### Fix 3: Clear Browser Storage

- Clear localStorage
- Clear cookies
- Hard refresh (Ctrl+F5)

## Expected Logs:

### Middleware Logs:

```
Middleware - Path: /api/profile
Middleware - Authorization header: Bearer eyJ...
Middleware - Token extracted: Present
Middleware - JWT_SECRET available: Yes
Middleware - Token verified successfully, userId: 1
```

### Profile API Logs:

```
Profile API - Request headers: {...}
Profile API - Authorization header: Bearer eyJ...
Profile API - X-User-ID header: 1
Profile API - User ID extracted: 1
Profile API - Successfully fetched profile for user: username
```

## If Still Not Working:

1. Check if user exists in database
2. Verify JWT token is valid
3. Check Prisma connection
4. Verify middleware is running
5. Check for CORS issues
