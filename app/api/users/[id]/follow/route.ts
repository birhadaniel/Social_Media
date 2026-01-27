// Add this import to the top of the file
import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

import { getUserFromRequest } from '@/lib/utils';
import { createSuccessResponse, createErrorResponse } from '@/lib/apiResponse';
import prisma from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
     // Verify JWT token directly in the API route
     const token = request.headers.get('authorization')?.split(' ')[1];
     if (!token) {
       return createErrorResponse('Authentication required', 401);
     }
     
     let followerId: number;
     try {
       const decoded = verifyToken(token);
       followerId = decoded.userId;
     } catch (error) {
       console.error('JWT verification failed:', error);
       return createErrorResponse('Invalid token', 401);
     }
     
     // Correct the variable name
     const { id } = await params;
     const followedId = parseInt(id);
      
      if (followerId === followedId) {
        return createErrorResponse('Cannot follow yourself', 400);
      }
      
      const userToFollow = await prisma.user.findUnique({
        where: { id: followedId },
      });
      
      if (!userToFollow) {
        return createErrorResponse('User not found', 404);
      }
      
      const existingFollow = await prisma.follow.findFirst({
        // Use 'followedId' in the query
        where: {
          followerId,
          followedId,
        },
      });
      
      if (existingFollow) {
        return createErrorResponse('Already following this user', 400);
      }
      
      const follow = await prisma.follow.create({
        // Use 'followedId' in the data
        data: {
          followerId,
          followedId,
        },
      });
      
      return createSuccessResponse(follow, 'User followed successfully');
      
    } catch (error) {
      console.error('Follow error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('User ID not found')) {
          return createErrorResponse('Authentication required', 401);
        }
        return createErrorResponse(error.message, 400);
      }
      
      return createErrorResponse('Failed to follow user', 500);
    }
  }
  export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
     try {
       // Verify JWT token directly in the API route
       const token = request.headers.get('authorization')?.split(' ')[1];
       if (!token) {
         return createErrorResponse('Authentication required', 401);
       }
       
       let followerId: number;
       try {
         const decoded = verifyToken(token);
         followerId = decoded.userId;
       } catch (error) {
         console.error('JWT verification failed:', error);
         return createErrorResponse('Invalid token', 401);
       }
       
       // Correct the variable name
       const { id } = await params;
       const followedId = parseInt(id);
        
        const existingFollow = await prisma.follow.findFirst({
          // Use 'followedId' in the query
          where: {
            followerId,
            followedId,
          },
        });
        
        if (!existingFollow) {
          return createErrorResponse('Not following this user', 400);
        }
        
        await prisma.follow.delete({
          where: {
            id: existingFollow.id,
          },
        });
        
        return createSuccessResponse({}, 'User unfollowed successfully');
        
      } catch (error) {
        console.error('Unfollow error:', error);
        
        if (error instanceof Error) {
          if (error.message.includes('User ID not found')) {
            return createErrorResponse('Authentication required', 401);
          }
          return createErrorResponse(error.message, 400);
        }
        
        return createErrorResponse('Failed to unfollow user', 500);
      }
    }

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
   const token = request.headers.get('authorization')?.split(' ')[1];
   if (!token) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   try {
     const { userId } = verifyToken(token);
     // Correct the variable name to match the schema
     const { id } = await params;
     const followedId = parseInt(id);

      const follow = await prisma.follow.findFirst({
        // Use 'followedId' in the query
        where: { followerId: userId, followedId },
      });
  
      return NextResponse.json({ isFollowing: !!follow }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to check follow status' },
        { status: 400 }
      );
    }
  }