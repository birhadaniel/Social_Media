import { NextResponse } from 'next/server';
import { sendMessage, getMessagesBetweenUsers, deleteMessage } from '@/services/messages/manage';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const messageSchema = z.object({
  receiverId: z.number().int().positive(),
  content: z.string().min(1, 'Message content is required'),
});

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');

    // START: Added for debugging
    console.log('Received Token:', token);
    console.log('Server JWT_SECRET:', process.env.JWT_SECRET);
    // END: Added for debugging

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId } = verifyToken(token);
    const body = await req.json();
    const { receiverId, content } = messageSchema.parse(body);

    const message = await sendMessage(userId, receiverId, content);
    return NextResponse.json({ message: 'Message sent successfully', message }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in API route:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId } = verifyToken(token);
    const { searchParams } = new URL(req.url);
    const otherUserId = parseInt(searchParams.get('otherUserId') || '');
    if (!otherUserId) return NextResponse.json({ error: 'otherUserId is required' }, { status: 400 });

    const messages = await getMessagesBetweenUsers(userId, otherUserId);
    return NextResponse.json(messages);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId } = verifyToken(token);
    const { searchParams } = new URL(req.url);
    const messageId = parseInt(searchParams.get('messageId') || '');
    if (!messageId) return NextResponse.json({ error: 'messageId is required' }, { status: 400 });

    await deleteMessage(messageId, userId);
    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}