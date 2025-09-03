import prisma from '@/lib/db';

export async function getPosts(userId?: number, page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;

    const where = userId ? { userId } : {};

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          content: true,
          mediaUrls: true,
          likesCount: true,
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
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch posts');
  }
}