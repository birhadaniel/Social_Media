import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/apiResponse';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
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
      // Fetch messages for a specific conversation (inbox context)
      const targetId = parseInt(conversationId, 10);
      console.log('Messages API - Fetching messages for conversationId:', conversationId);
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: targetId },
            { senderId: targetId, receiverId: userId },
          ],
        },
        include: {
          sender: { select: { id: true, username: true, profilePicture: true } },
          receiver: { select: { id: true, username: true, profilePicture: true } },
        },
        orderBy: { createdAt: 'asc' },
      });
      return createSuccessResponse(messages, 'Conversation messages retrieved successfully');
    }

    // Fetch list of conversations (inbox for the authenticated user)
    console.log('Messages API - Fetching inbox for userId:', userId);
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      select: {
        id: true,
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

    const conversationsMap = new Map();
    for (const message of messages) {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const otherUser = message.senderId === userId ? message.receiver : message.sender;

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          id: otherUserId.toString(),
          user: {
            id: otherUser.id,
            username: otherUser.username,
            profilePicture: otherUser.profilePicture,
          },
          lastMsg: {
            content: message.content,
            createdAt: message.createdAt,
          },
        });
      }
    }

    const conversations = Array.from(conversationsMap.values());
    console.log('Messages API - Inbox conversations found:', conversations.length);
    return createSuccessResponse(conversations, 'Inbox retrieved successfully');
  } catch (error) {
    console.error('Messages API - Error:', error);
    return createErrorResponse('Failed to fetch inbox', 500);
  }
}

// POST remains unchanged
export async function POST(request: NextRequest) {
  try {
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

    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      console.log('Messages API - Receiver not found, receiverId:', receiverId);
      return createErrorResponse('Receiver not found', 404);
    }

    console.log('Messages API - Creating message in inbox for receiverId:', receiverId, 'from senderId:', senderId);
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
      include: {
        sender: { select: { id: true, username: true, profilePicture: true } },
        receiver: { select: { id: true, username: true, profilePicture: true } },
      },
    });

    console.log('Messages API - Message created in inbox, id:', message.id);
    return createSuccessResponse(message, 'Message sent to inbox successfully', 201);
  } catch (error) {
    console.error('Messages API - Error:', error);
    return createErrorResponse('Failed to send message to inbox', 500);
  }
}