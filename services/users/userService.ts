import prisma from "@/lib/db";

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, email: true, createdAt: true },
  });
}

export async function updateUser(id: number, data: { username?: string; email?: string }) {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, username: true, email: true, updatedAt: true },
  });
}

export async function getFollowers(userId: number) {
  return prisma.follow.findMany({
    where: { followingId: userId },
    include: { follower: { select: { id: true, username: true } } },
  });
}

export async function followUser(followerId: number, followingId: number) {
  if (followerId === followingId) throw new Error("You cannot follow yourself");

  return prisma.follow.create({
    data: { followerId, followingId },
  });
}

export async function unfollowUser(followerId: number, followingId: number) {
  return prisma.follow.delete({
    where: { followerId_followingId: { followerId, followingId } },
  });
}
