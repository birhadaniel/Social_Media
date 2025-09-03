import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';
// import { followSchema } from '@/lib/validators';
import { followUser } from '@/services/users/follow';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId } = verifyToken(token);
    const follow = await followUser(userId, { followedId: parseInt(params.id) });
    return NextResponse.json(follow, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to follow user' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId } = verifyToken(token);
    const followedId = parseInt(params.id);

    const existingFollow = await prisma.follow.findFirst({
      where: { followerId: userId, followedId },
    });
    if (!existingFollow) {
      return NextResponse.json({ error: 'Not following this user' }, { status: 400 });
    }

    await prisma.follow.delete({
      where: { id: existingFollow.id },
    });

    return NextResponse.json({ message: 'Unfollowed successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to unfollow user' },
      { status: 400 }
    );
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId } = verifyToken(token);
    const followedId = parseInt(params.id);

    const follow = await prisma.follow.findFirst({
      where: { followerId: userId, followedId },
    });

    return NextResponse.json({ isFollowing: !!follow }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check follow status' },
      { status: 400 }
    );
  }
}