// services/posts/manage.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createPost(userId: number, content: string, imageUrl?: string) {
  return prisma.post.create({
    data: {
      content,
      authorId: userId,
      imageUrl,
    },
  });
}

export async function getPostById(id: number) {
  return prisma.post.findUnique({
    where: { id },
    include: { author: { select: { id: true, username: true } } },
  });
}

export async function getPosts() {
  return prisma.post.findMany({
    include: { 
      author: { select: { id: true, username: true } },
      likes: { select: { userId: true } },
      comments: { select: { id: true } }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updatePost(id: number, content: string, imageUrl?: string) {
  return prisma.post.update({
    where: { id },
    data: { content, imageUrl },
  });
}

export async function deletePost(id: number) {
  return prisma.post.delete({ where: { id } });
}