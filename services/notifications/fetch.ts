import prisma from '@/lib/db';

export async function fetchNotifications(userId: number, page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        select: {
          id: true,
          userId: true,
          triggeredById: true,
          type: true,
          postId: true,
          commentId: true,
          messageId: true,
          createdAt: true,
          triggeredBy: {
            select: {
              id: true,
              username: true,
            },
          },
          post: {
            select: {
              id: true,
              content: true,
            },
          },
          comment: {
            select: {
              id: true,
              content: true,
            },
          },
          message: {
            select: {
              id: true,
              content: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch notifications');
  }
}