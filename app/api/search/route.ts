import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/apiResponse';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/db';

type UserResult = {
  id: number;
  username: string;
  bio: string | null;
  profilePicture: string | null;
  _count: {
    followers: number;
    following: number;
    posts: number;
  };
};

type PostResult = {
  id: number;
  content: string | null;
  createdAt: Date;
  likesCount: number;
  user: {
    id: number;
    username: string;
  } | null;
};

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      console.log('Search API - No token provided');
      return createErrorResponse('Authentication required', 401);
    }

    let userId: number;
    try {
      const decoded = verifyToken(token);
      userId = decoded.userId;
      console.log('Search API - JWT decoded, userId:', userId);
    } catch (error) {
      console.error('Search API - JWT verification failed:', error);
      return createErrorResponse('Invalid token', 401);
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      console.log('Search API - Invalid or short query:', query);
      return createErrorResponse('Search query must be at least 2 characters', 400);
    }

    console.log('Search API - Searching for query:', query);

    // Search users by username
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        username: true,
        bio: true,
        profilePicture: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
      take: 5, // Limit for performance
    });

    // Search posts by content
    const posts = await prisma.post.findMany({
      where: {
        content: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        likesCount: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      take: 5, // Limit for performance
    });

    // Check following status and conversations for users
    const userResults = await Promise.all(
      users.map(async (user: UserResult) => {
        const isFollowing = await prisma.follow.findFirst({
          where: {
            followerId: userId,
            followedId: user.id,
          },
        });

        const hasConversation = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: user.id },
              { senderId: user.id, receiverId: userId },
            ],
          },
        });

        return {
          id: user.id.toString(),
          type: 'user' as const,
          name: user.username,
          username: user.username,
          bio: user.bio,
          avatar: user.profilePicture,
          isFollowing: !!isFollowing,
          hasConversation: !!hasConversation,
        };
      })
    );

    // Format post results
    const postResults = posts.map((post: PostResult) => ({
      id: post.id.toString(),
      type: 'post' as const,
      content: post.content,
      author: post.user?.username || 'Unknown',
    }));

    const results = [...userResults, ...postResults];
    console.log('Search API - Results found:', results.length);
    return createSuccessResponse(results, 'Search results retrieved successfully');
  } catch (error) {
    console.error('Search API - Error:', error);
    return createErrorResponse('Failed to perform search', 500);
  }
}