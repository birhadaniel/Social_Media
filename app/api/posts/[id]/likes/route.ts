import { NextResponse } from 'next/server';
import { likePost, unlikePost, getLikesByPostId } from '@/services/interactions/manage';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId } = verifyToken(token);
    const postId = Number(params.id);

    const like = await likePost(userId, postId);
    return NextResponse.json({ message: 'Post liked successfully', like }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId } = verifyToken(token);
    const postId = Number(params.id);

    await unlikePost(userId, postId);
    return NextResponse.json({ message: 'Post unliked successfully' });
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

    const likes = await getLikesByPostId(postId);
    return NextResponse.json(likes);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}