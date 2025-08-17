// services/posts/manage.ts
import prisma from "@/lib/db";


export async function getPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
}


export async function getPostById(postId: number) {
  return prisma.post.findUnique({ where: { id: postId } });
}

export async function updatePost(postId: number, content: string) {
  return prisma.post.update({
    where: { id: postId },
    data: { content },
  });
}

export async function deletePost(postId: number) {
  return prisma.post.delete({ where: { id: postId } });
}
