# Social Media App - Frontend-Backend Integration Guide

## Overview

This guide explains how to integrate the React frontend with the Node.js backend to create a fully functional social media application.

## Current Architecture

### Backend (Next.js API Routes)

- ✅ **Authentication**: Login, Register, Reset Password
- ✅ **User Management**: CRUD operations, follow/unfollow
- ✅ **Posts**: Create, read, update, delete
- ✅ **Interactions**: Like, comment, follow
- ✅ **Notifications**: Real-time notifications
- ✅ **Messages**: Direct messaging system

### Frontend (React Components)

- ✅ **Authentication**: Login/Register forms
- ✅ **Feed**: Post display and interaction
- ✅ **Profile**: User profiles and editing
- ✅ **Messages**: Chat interface
- ✅ **Notifications**: Notification display

## Integration Components Created

### 1. Middleware (`lib/middleware.ts`)

- Handles CORS for cross-origin requests
- Authenticates protected API routes
- Adds user ID to request headers

### 2. Enhanced API Client (`lib/apiClient.ts`)

- Retry logic with exponential backoff
- Automatic token management
- Error handling and status codes
- Rate limiting support

### 3. Error Boundary (`components/ui/ErrorBoundary.tsx`)

- Catches React errors gracefully
- Provides user-friendly error messages
- Development mode error details

### 4. Loading Components (`components/ui/LoadingSpinner.tsx`)

- Loading spinners for different sizes
- Loading page component
- Loading button states

### 5. API Response Handler (`lib/apiResponse.ts`)

- Standardized API responses
- Consistent error handling
- HTTP status code management

### 6. Rate Limiting (`lib/rateLimit.ts`)

- In-memory rate limiting
- Configurable request limits
- Automatic cleanup

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/social_media_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here-change-in-production"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# App
NODE_ENV="development"
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
m run build

# Seed database (optional)
npx prisma db seed
```

### 3. Start Development Server

```bash
npm run dev
```

## API Integration Points

### Authentication Flow

1. User submits login/register form
2. Frontend calls `/api/auth/login` or `/api/auth/register`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. Token is included in subsequent API requests

### Protected Routes

- All API routes except auth endpoints require valid JWT
- Middleware validates token and adds user ID to headers
- Frontend automatically redirects to login on auth failure

### Error Handling

- Standardized error responses across all endpoints
- Frontend displays user-friendly error messages
- Automatic retry for network failures
- Rate limiting with exponential backoff

## Frontend-Backend Communication

### API Calls

```typescript
// Using the enhanced API client
import { apiClient } from "@/lib/apiClient";

// Login
const { user, token } = await apiClient.login({ email, password });

// Create post
const post = await apiClient.createPost({ content: "Hello world!" });

// Get feed
const feed = await apiClient.getFeed(1, 10);
```

### State Management

- Zustand for global state management
- React Context for authentication state
- Local storage for persistent data

### Real-time Updates

- WebSocket connections for live notifications
- Polling for feed updates
- Optimistic UI updates

## Testing the Integration

### 1. Test Authentication

```bash
# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Test Protected Routes

```bash
# Test with valid token
curl -X GET http://localhost:3000/api/posts/feed \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Test Frontend

- Navigate to http://localhost:3000
- Register a new account
- Create posts and interact with the feed
- Test following/unfollowing users

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure middleware is properly configured
   - Check browser console for CORS headers

2. **Authentication Failures**

   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper Authorization header format

3. **Database Connection**

   - Verify DATABASE_URL is correct
   - Check PostgreSQL service is running
   - Run `npx prisma db push` to sync schema

4. **Rate Limiting**
   - Check rate limit headers in response
   - Implement exponential backoff in frontend
   - Monitor API usage patterns

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=* npm run dev
```

## Production Deployment

### Environment Variables

- Set production DATABASE_URL
- Use strong JWT_SECRET
- Configure CORS origins
- Enable HTTPS

### Performance Optimization

- Implement Redis for rate limiting
- Add CDN for static assets
- Enable compression
- Monitor API response times

## Security Considerations

1. **JWT Security**

   - Use short expiration times
   - Implement refresh tokens
   - Secure token storage

2. **Rate Limiting**

   - Prevent API abuse
   - Monitor suspicious activity
   - Implement IP-based limits

3. **Input Validation**

   - Validate all user inputs
   - Sanitize data before storage
   - Use prepared statements

4. **CORS Configuration**
   - Restrict allowed origins
   - Limit HTTP methods
   - Validate headers

## Next Steps

1. **Real-time Features**

   - Implement WebSocket connections
   - Add push notifications
   - Live chat functionality

2. **Advanced Features**

   - File uploads and media handling
   - Search and filtering
   - Analytics and reporting

3. **Performance**

   - Implement caching strategies
   - Add database indexing
   - Optimize queries

4. **Testing**
   - Unit tests for components
   - Integration tests for API
   - End-to-end testing

## Support

For integration issues:

1. Check the console logs
2. Verify environment configuration
3. Test API endpoints independently
4. Review middleware configuration
5. Check database connectivity

The application is now fully integrated and ready for development and testing!
