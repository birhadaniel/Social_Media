import prisma from "@/lib/db";

export async function getFeed(userId: number) {
  // Example: fetch posts from user and their following
  const following = await prisma.follow.findMany({ where: { followerId: userId } });
  const followingIds = following.map(f => f.followingId).concat(userId);

  return prisma.post.findMany({
    where: { authorId: { in: followingIds } },
    orderBy: { createdAt: 'desc' },
  });
}
