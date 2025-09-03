import { NextResponse } from 'next/server';
import { getUserProfile, updateUserProfile } from '@/services/users/profile';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // Await params to resolve the dynamic route parameter
    const { id } = await context.params;
    const userId = parseInt(id);

    const user = await getUserProfile(userId);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: error instanceof Error && error.message === 'User not found' ? 404 : 500 }
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId } = verifyToken(token);
    // Await params to resolve the dynamic route parameter
    const { id } = await context.params;
    const targetUserId = parseInt(id);

    if (userId !== targetUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const user = await updateUserProfile(userId, body);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid input or token' },
      { status: 400 }
    );
  }
}