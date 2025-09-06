import prisma from '@/lib/db';

// Define the type for the result of the Prisma `follow.findMany` query
type FollowResult = {
  followedId: number;
};

export async function getFeed(userId: number, page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;

    // Get IDs of users the authenticated user follows
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followedId: true },
    });
    const followingIds = following.map((f: FollowResult) => f.followedId);

    // Include the user's own posts
    const where = {
      userId: { in: [...followingIds, userId] },
    };

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
    throw error instanceof Error ? error : new Error('Failed to fetch feed');
  }
}