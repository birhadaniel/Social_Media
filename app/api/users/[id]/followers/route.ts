import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { followerSchema } from '@/lib/validators';
import { unfollowUser } from '@/services/users/follow';


export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const userId = parseInt(id);

    const followers = await prisma.follow.findMany({
      where: { followedId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedFollowers = followers.map((follow) => ({
      id: follow.follower.id,
      username: follow.follower.username,
      profilePicture: follow.follower.profilePicture,
      bio: follow.follower.bio,
    }));

    return NextResponse.json(formattedFollowers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch followers' },
      { status: 400 }
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
    const { id } = await context.params;
    const followedId = parseInt(id);

    // Ensure the authenticated user is the owner of the profile
    if (userId !== followedId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { followerId } = followerSchema.parse(body);

    const result = await unfollowUser(followerId, followedId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to remove follower' },
      { status: 400 }
    );
  }
}