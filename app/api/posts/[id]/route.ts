// app/api/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/services/posts/manage";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const post = await getPostById(Number(params.id));
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId } = verifyToken(token);
    const { content } = await req.json();

    const post = await getPostById(Number(params.id));
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.userId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updatedPost = await updatePost(Number(params.id), content);

    return NextResponse.json(updatedPost);

  } catch (error: unknown) {
    if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId } = verifyToken(token);

    const post = await getPostById(Number(params.id));
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.userId !== userId)
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
