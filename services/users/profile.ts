import prisma from '@/lib/db';
import { profileSchema } from '@/lib/validators';


export async function getUserProfile(userId: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        bio: true,
        profilePicture: true,
        createdAt: true,
        _count: { select: { posts: true, followers: true, following: true } },
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch profile');
  }
}

export async function updateUserProfile(userId: number, data: unknown) {
  try {
    const { bio, profilePicture } = profileSchema.parse(data);
    const user = await prisma.user.update({
      where: { id: userId },
      data: { bio, profilePicture },
      select: { id: true, username: true, bio: true, profilePicture: true },
    });
    return user;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to update profile');
  }
}