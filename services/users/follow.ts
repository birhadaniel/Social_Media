import prisma from '@/lib/db';
import { followSchema } from '@/lib/validators';

export async function followUser(followerId: number, data: unknown) {
  try {
    const { followedId } = followSchema.parse(data);
    if (followerId === followedId) {
      throw new Error('Cannot follow yourself');
    }

    const existingFollow = await prisma.follow.findFirst({
      where: { followerId, followedId },
    });
    if (existingFollow) {
      throw new Error('Already following this user');
    }

    const follow = await prisma.follow.create({
      data: { followerId, followedId },
    });

    await prisma.notification.create({
      data: {
        userId: followedId,
        type: 'FOLLOW',
        triggeredById: followerId,
      },
    });

    return follow;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to follow user');
  }
}

export async function unfollowUser(followerId: number, followedId: number) {
  try {
    const existingFollow = await prisma.follow.findFirst({
      where: { followerId, followedId },
    });
    if (!existingFollow) {
      throw new Error('Not following this user');
    }

    await prisma.follow.delete({
      where: { id: existingFollow.id },
    });

    return { message: 'Unfollowed successfully' };
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to unfollow user');
  }
}

export async function checkFollowStatus(followerId: number, followedId: number) {
  try {
    const follow = await prisma.follow.findFirst({
      where: { followerId, followedId },
    });
    return { isFollowing: !!follow };
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to check follow status');
  }
}