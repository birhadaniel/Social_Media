import { NextRequest } from 'next/server';

export function getUserFromRequest(request: NextRequest): number {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    throw new Error('User ID not found in request headers');
  }
  return parseInt(userId, 10);
}

export function validatePaginationParams(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  if (page < 1 || limit < 1 || limit > 100) {
    throw new Error('Invalid pagination parameters');
  }
  
  return { page, limit };
}

// Note: These functions are now handled by lib/apiResponse.ts
// Keeping them here for backward compatibility but they're not used
export function createErrorResponse(message: string, status: number = 400) {
  return {
    error: message,
    status,
    timestamp: new Date().toISOString(),
  };
}

export function createSuccessResponse<T>(data: T, message?: string) {
  return {
    data,
    message,
    success: true,
    timestamp: new Date().toISOString(),
  };
}
