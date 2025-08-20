import prisma from "@/lib/db";

export async function createPost(authorId: number, content: string, imageUrl?: string) {
  return prisma.post.create({
    data: {
      authorId,
      content,
      imageUrl,
    },
  });
}
