import {  NextResponse } from "next/server";
import { createPost } from "@/services/posts/create";
import { getPosts } from "@/services/posts/manage";
import { verifyToken } from "@/lib/auth";
import { z } from 'zod';


const postSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().url().optional(),
});

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json(posts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId } = verifyToken(token);
    const body = await req.json();
    const { content, imageUrl } = postSchema.parse(body);

    const post = await createPost(userId, content, imageUrl);
    return NextResponse.json({ message: "Post created successfully", post }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}