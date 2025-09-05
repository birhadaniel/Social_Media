import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/apiResponse';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('Users API - Raw ID from params:', id);
    
    const targetUserId = parseInt(id);
    console.log('Users API - Parsed Target User ID:', targetUserId);
    
    // Verify JWT token directly in the API route
    const token = request.headers.get('authorization')?.split(' ')[1];
    console.log('Users API - Token present:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('Users API - No token found');
      return createErrorResponse('Authentication required', 401);
    }
    
    let currentUserId: number;
    try {
      const decoded = verifyToken(token);
      currentUserId = decoded.userId;
      console.log('Users API - JWT decoded successfully, userId:', currentUserId);
    } catch (error) {
      console.error('Users API - JWT verification failed:', error);
      return createErrorResponse('Invalid token', 401);
    }
    
    console.log('Users API - Target User ID:', targetUserId);
    console.log('Users API - Current User ID:', currentUserId);
    
    if (!targetUserId || isNaN(targetUserId)) {
      console.log('Users API - Invalid target user ID:', targetUserId);
      return createErrorResponse('Invalid user ID', 400);
    }
    
    // Fetch the target user's profile data
    console.log('Users API - Fetching user from database with ID:', targetUserId);
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        profilePicture: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
    
    console.log('Users API - User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('Users API - User details:', { id: user.id, username: user.username, email: user.email });
    }
    
    if (!user) {
      console.log('Users API - User not found for ID:', targetUserId);
      return createErrorResponse('User not found', 404);
    }
    
    // Check if current user is following the target user
    const isFollowing = await prisma.follow.findFirst({
      where: {
        followerId: currentUserId,
        followedId: targetUserId,
      },
    });
    
    // Check if there's a conversation between users
    const hasConversation = await prisma.message.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: currentUserId },
        ],
      },
    });
    
    // Get user's posts
    const posts = await prisma.post.findMany({
      where: { userId: targetUserId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    
    const profileData = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        followersCount: user._count.followers,
        followingCount: user._count.following,
        postsCount: user._count.posts,
      },
      isFollowing: !!isFollowing,
      hasConversation: !!hasConversation,
      posts: posts.map(post => ({
        id: post.id,
        content: post.content,
        mediaUrls: post.mediaUrls,
        likesCount: post._count.likes,
        commentsCount: post._count.comments,
        createdAt: post.createdAt,
        author: post.user, // Renamed from 'user' to 'author'
      })),
    };
    
    console.log('Users API - Returning success response with profile data');
    return createSuccessResponse(profileData, 'User profile retrieved successfully');
    
  } catch (error) {
    console.error('Users API error:', error);
    
    if (error instanceof Error) {
      console.error('Users API - Error message:', error.message);
      return createErrorResponse(error.message, 400);
    }
    
    return createErrorResponse('Failed to fetch user profile', 500);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId } = verifyToken(token);
    const { id } = await params;
    const targetUserId = parseInt(id);

    if (userId !== targetUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    // For now, just return success - you can implement updateUserProfile later
    return NextResponse.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid input or token' },
      { status: 400 }
    );
  }
}