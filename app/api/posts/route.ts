import {  NextResponse } from "next/server";
import { createPost } from "@/services/posts/create";
import { getPosts } from "@/services/posts/manage";
import { verifyToken } from "@/lib/auth";


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
    const { content } = await req.json();
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId } = verifyToken(token);
    const post = await createPost(userId, content);

    return NextResponse.json(post);
  } catch (error: unknown) {
    if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}