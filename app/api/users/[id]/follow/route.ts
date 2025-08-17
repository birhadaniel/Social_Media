import { NextResponse } from 'next/server';
import { followUser, unfollowUser, getFollowersAndFollowing } from '@/services/interactions/manage';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params; // Await params
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    const followingId = parseInt(params.id);
    const follow = await followUser(payload.userId, followingId);

    return NextResponse.json({ message: 'User followed successfully', follow }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params; // Await params
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    const followingId = parseInt(params.id);
    await unfollowUser(payload.userId, followingId);

    return NextResponse.json({ message: 'User unfollowed successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params; // Await params
    const userId = parseInt(params.id);
    const followersAndFollowing = await getFollowersAndFollowing(userId);

    return NextResponse.json(followersAndFollowing);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}