import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/apiResponse';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      console.log('Messages API - No token provided');
      return createErrorResponse('Authentication required', 401);
    }

    let userId: number;
    try {
      const decoded = verifyToken(token);
      userId = decoded.userId;
      console.log('Messages API - JWT decoded, userId:', userId);
    } catch (error) {
      console.error('Messages API - JWT verification failed:', error);
      return createErrorResponse('Invalid token', 401);
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversation');

    if (conversationId) {
      // Fetch messages for a specific conversation
      console.log('Messages API - Fetching messages for conversationId:', conversationId);
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: parseInt(conversationId) },
            { senderId: parseInt(conversationId), receiverId: userId },
          ],
        },
        include: {
          sender: {
            select: { id: true, username: true, profilePicture: true },
          },
          receiver: {
            select: { id: true, username: true, profilePicture: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      console.log('Messages API - Messages found:', messages.length);
      return createSuccessResponse(messages, 'Messages retrieved successfully');
    } else {
      // Fetch list of conversations
      console.log('Messages API - Fetching conversations for userId:', userId);
      const messages = await prisma.message.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
        select: {
          senderId: true,
          receiverId: true,
          sender: {
            select: { id: true, username: true, profilePicture: true },
          },
          receiver: {
            select: { id: true, username: true, profilePicture: true },
          },
          content: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Group messages by conversation partner
      const conversationsMap = new Map();
      for (const message of messages) {
        const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
        const otherUser = message.senderId === userId ? message.receiver : message.sender;

        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            user: {
              id: otherUser.id,
              username: otherUser.username,
              profilePicture: otherUser.profilePicture,
            },
            lastMessage: {
              content: message.content,
              createdAt: message.createdAt,
            },
          });
        }
      }

      const conversations = Array.from(conversationsMap.values());
      console.log('Messages API - Conversations found:', conversations.length);
      return createSuccessResponse(conversations, 'Conversations retrieved successfully');
    }
  } catch (error) {
    console.error('Messages API - Error:', error);
    return createErrorResponse('Failed to fetch conversations', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify JWT token
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      console.log('Messages API - No token provided');
      return createErrorResponse('Authentication required', 401);
    }

    let senderId: number;
    try {
      const decoded = verifyToken(token);
      senderId = decoded.userId;
      console.log('Messages API - JWT decoded, senderId:', senderId);
    } catch (error) {
      console.error('Messages API - JWT verification failed:', error);
      return createErrorResponse('Invalid token', 401);
    }

    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      console.log('Messages API - Missing receiverId or content');
      return createErrorResponse('Receiver ID and content are required', 400);
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      console.log('Messages API - Receiver not found, receiverId:', receiverId);
      return createErrorResponse('Receiver not found', 404);
    }

    // Create the message
    console.log('Messages API - Creating message from senderId:', senderId, 'to receiverId:', receiverId);
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
      include: {
        sender: {
          select: { id: true, username: true, profilePicture: true },
        },
        receiver: {
          select: { id: true, username: true, profilePicture: true },
        },
      },
    });

    console.log('Messages API - Message created, id:', message.id);
    return createSuccessResponse(message, 'Message sent successfully', 201);
  } catch (error) {
    console.error('Messages API - Error:', error);
    return createErrorResponse('Failed to send message', 500);
  }
}