import { NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/services/posts/manage";
import { verifyToken } from "@/lib/auth";
import { z } from 'zod';

const updatePostSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().url().optional(),
});

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params; // Await params
  const post = await getPostById(Number(params.id));
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params; // Await params
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId } = verifyToken(token);
    const body = await req.json();
    const { content, imageUrl } = updatePostSchema.parse(body);

    const post = await getPostById(Number(params.id));
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.authorId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updatedPost = await updatePost(Number(params.id), content, imageUrl);
    return NextResponse.json(updatedPost);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params; // Await params
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId } = verifyToken(token);
    const post = await getPostById(Number(params.id));
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.authorId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await deletePost(Number(params.id));
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}