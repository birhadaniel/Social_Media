import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/apiResponse';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return createErrorResponse('Authentication required', 401);

    const { userId } = verifyToken(token);
    console.log('Settings API - Fetching settings for userId:', userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        notificationPreferences: true,
      },
    });

    if (!user) return createErrorResponse('User not found', 404);

    return createSuccessResponse(
      {
        notifications: user.notificationPreferences || true,
      },
      'Settings retrieved successfully'
    );
  } catch (error) {
    console.error('Settings API error:', error);
    return createErrorResponse('Failed to fetch settings', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return createErrorResponse('Authentication required', 401);

    const { userId } = verifyToken(token);
    console.log('Settings API - Updating settings for userId:', userId);

    const body = await request.json();
    const { notifications } = body;

    if (typeof notifications !== 'boolean') return createErrorResponse('Invalid settings data', 400);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        notificationPreferences: notifications,
      },
      select: {
        id: true,
        notificationPreferences: true,
      },
    });

    return createSuccessResponse(
      { notifications: updatedUser.notificationPreferences },
      'Settings updated successfully'
    );
  } catch (error: unknown) {
    console.error('Settings API error:', error);
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return createErrorResponse('User not found', 404);
    }
    return createErrorResponse('Failed to update settings', 500);
  }
}