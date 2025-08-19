import { NextResponse } from 'next/server';
import { addComment, getCommentsByPostId } from '@/services/interactions/manage';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
});

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId } = verifyToken(token);
    const body = await req.json();
    const { content } = commentSchema.parse(body);
    const postId = Number(params.id);

    const comment = await addComment(userId, postId, content);
    return NextResponse.json({ message: 'Comment added successfully', comment }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const postId = Number(params.id);

    const comments = await getCommentsByPostId(postId);
    return NextResponse.json(comments);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}