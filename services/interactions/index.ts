import prisma from '@/lib/db';
import { createCommentSchema } from '@/lib/validators';
import { triggerNotification } from '@/services/notifications/trigger';

export async function createComment(userId: number, postId: number, data: unknown) {
  try {
    const { content } = createCommentSchema.parse(data);

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new Error('Post not found');
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    // Create notification for post owner (if not commenting on own post)
    if (post.userId && post.userId !== userId) {
      await triggerNotification({
        userId: post.userId,
        triggeredById: userId,
        type: 'COMMENT',
        postId,
        commentId: comment.id,
      });
    }

    return comment;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to create comment');
  }
}

export async function getComments(postId: number, page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where: { postId } }),
    ]);

    return {
      comments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch comments');
  }
}

export async function createLike(userId: number, postId: number) {
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new Error('Post not found');
    }

    const existingLike = await prisma.like.findFirst({
      where: { userId, postId },
    });
    if (existingLike) {
      throw new Error('Already liked this post');
    }

    const [like] = await prisma.$transaction([
      prisma.like.create({
        data: {
          userId,
          postId,
        },
        select: {
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);

    // Create notification for post owner (if not liking own post)
    if (post.userId && post.userId !== userId) {
      await triggerNotification({
        userId: post.userId,
        triggeredById: userId,
        type: 'LIKE',
        postId,
      });
    }

    return like;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to like post');
  }
}

export async function deleteLike(userId: number, postId: number) {
  try {
    const like = await prisma.like.findFirst({
      where: { userId, postId },
    });
    if (!like) {
      throw new Error('Not liked this post');
    }

    await prisma.$transaction([
      prisma.like.delete({
        where: { id: like.id },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      }),
      prisma.notification.deleteMany({
        where: { userId: { not: userId }, triggeredById: userId, postId, type: 'LIKE' },
      }),
    ]);

    return { message: 'Unliked successfully' };
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to unlike post');
  }
}

export async function getLikes(postId: number, page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      prisma.like.findMany({
        where: { postId },
        select: {
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.like.count({ where: { postId } }),
    ]);

    return {
      likes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch likes');
  }
}

export async function followUser(followerId: number, followedId: number) {
  try {
    if (followerId === followedId) throw new Error('Cannot follow yourself');

    const user = await prisma.user.findUnique({ where: { id: followedId } });
    if (!user) throw new Error('User not found');

    const existingFollow = await prisma.follow.findUnique({
      where: { followerId_followedId: { followerId, followedId } },
    });
    if (existingFollow) throw new Error('Already following this user');

    const follow = await prisma.follow.create({
      data: { followerId, followedId },
      select: {
        followerId: true,
        followedId: true,
        createdAt: true,
      },
    });

    await triggerNotification({
      userId: followedId,
      triggeredById: followerId,
      type: 'FOLLOW',
    });

    return follow;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to follow user');
  }
}

export async function unfollowUser(followerId: number, followedId: number) {
  try {
    const existingFollow = await prisma.follow.findUnique({
      where: { followerId_followedId: { followerId, followedId } },
    });
    if (!existingFollow) throw new Error('Not following this user');

    await prisma.$transaction([
      prisma.follow.delete({
        where: { followerId_followedId: { followerId, followedId } },
      }),
      prisma.notification.deleteMany({
        where: { userId: followedId, triggeredById: followerId, type: 'FOLLOW' },
      }),
    ]);

    return { message: 'Unfollowed successfully' };
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to unfollow user');
  }
}

export async function getFollowersAndFollowing(userId: number) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const followers = await prisma.follow.findMany({
      where: { followedId: userId },
      include: { follower: { select: { id: true, username: true } } },
    });

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: { select: { id: true, username: true } } },
    });

    return {
      followers: followers.map(f => f.follower),
      following: following.map(f => f.following),
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch followers and following');
  }
}