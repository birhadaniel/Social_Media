import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
  status: number;
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    status,
  };

  return NextResponse.json(response, { status });
}

export function createErrorResponse(
  error: string,
  status: number = 400,
  details?: unknown
): NextResponse<ApiResponse> {
  const response: ApiResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
    status,
  };

  if (details) {
    response.data = details;
  }

  return NextResponse.json(response, { status });
}

export function createValidationErrorResponse(
  errors: Record<string, string[]>
): NextResponse<ApiResponse> {
  return createErrorResponse('Validation failed', 400, { errors });
}

export function createNotFoundResponse(resource: string): NextResponse<ApiResponse> {
  return createErrorResponse(`${resource} not found`, 404);
}

export function createUnauthorizedResponse(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
  return createErrorResponse(message, 401);
}

export function createForbiddenResponse(message: string = 'Forbidden'): NextResponse<ApiResponse> {
  return createErrorResponse(message, 403);
}

export function createConflictResponse(message: string): NextResponse<ApiResponse> {
  return createErrorResponse(message, 409);
}

export function createInternalErrorResponse(message: string = 'Internal server error'): NextResponse<ApiResponse> {
  return createErrorResponse(message, 500);
}

export function createRateLimitResponse(
  retryAfter?: number,
  message: string = 'Too many requests'
): NextResponse<ApiResponse> {
  const response = createErrorResponse(message, 429);
  
  if (retryAfter) {
    response.headers.set('Retry-After', retryAfter.toString());
  }
  
  return response;
}
