import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle CORS
  const response = NextResponse.next();
  
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  // Skip auth for public routes
  const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/reset-password'];
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return response;
  }

  // For protected routes, just pass through - let API routes handle auth
  console.log('Middleware - Path:', request.nextUrl.pathname);
  console.log('Middleware - Authorization header present:', request.headers.get('authorization') ? 'Yes' : 'No');
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
