import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function likePost(userId: number, postId: number) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error('Post not found');

  const existingLike = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  if (existingLike) throw new Error('User already liked this post');

  return prisma.like.create({
    data: {
      userId,
      postId,
    },
  });
}

export async function unlikePost(userId: number, postId: number) {
  const existingLike = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  if (!existingLike) throw new Error('Like not found');

  return prisma.like.delete({
    where: { userId_postId: { userId, postId } },
  });
}

export async function getLikesByPostId(postId: number) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error('Post not found');

  return prisma.like.findMany({
    where: { postId },
    include: { user: { select: { id: true, username: true } } },
  });
}

export async function addComment(userId: number, postId: number, content: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error('Post not found');

  return prisma.comment.create({
    data: {
      content,
      userId,
      postId,
    },
  });
}

export async function getCommentsByPostId(postId: number) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error('Post not found');

  return prisma.comment.findMany({
    where: { postId },
    include: { user: { select: { id: true, username: true } } },
    orderBy: { createdAt: 'asc' },
  });
}

export async function followUser(followerId: number, followingId: number) {
  if (followerId === followingId) throw new Error('Cannot follow yourself');

  const user = await prisma.user.findUnique({ where: { id: followingId } });
  if (!user) throw new Error('User not found');

  const existingFollow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
  if (existingFollow) throw new Error('Already following this user');

  return prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });
}

export async function unfollowUser(followerId: number, followingId: number) {
  const existingFollow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
  if (!existingFollow) throw new Error('Not following this user');

  return prisma.follow.delete({
    where: { followerId_followingId: { followerId, followingId } },
  });
}

export async function getFollowers(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  return prisma.follow.findMany({
    where: { followingId: userId },
    include: { follower: { select: { id: true, username: true } } },
  });
}

export async function getFollowing(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  return prisma.follow.findMany({
    where: { followerId: userId },
    include: { following: { select: { id: true, username: true } } },
  });
}

export async function getFollowersAndFollowing(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const followers = await prisma.follow.findMany({
    where: { followingId: userId },
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
}