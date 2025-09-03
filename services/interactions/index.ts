import prisma from '@/lib/db';
import { createCommentSchema } from '@/lib/validators';

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
      await prisma.notification.create({
        data: {
          userId: post.userId,
          type: 'COMMENT',
          triggeredById: userId,
          postId,
        },
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

    const like = await prisma.$transaction([
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
      await prisma.notification.create({
        data: {
          userId: post.userId,
          type: 'LIKE',
          triggeredById: userId,
          postId,
        },
      });
    }

    return like[0];
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