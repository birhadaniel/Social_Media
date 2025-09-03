import prisma from '@/lib/db';
import { createPostSchema } from '@/lib/validators';

export async function createPost(userId: number, data: unknown) {
  try {
    const parsedData = createPostSchema.parse(data);
    const { content, mediaUrls = [] } = parsedData;

    if (!content && mediaUrls.length === 0) {
      throw new Error('Content or mediaUrls must be provided');
    }

    const post = await prisma.post.create({
      data: {
        content,
        mediaUrls,
        userId,
      },
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
    });

    return post;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to create post');
  }
}