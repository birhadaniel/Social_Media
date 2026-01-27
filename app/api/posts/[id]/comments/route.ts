import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createComment, getComments } from "@/services/interactions";

// Use the correct type for the GET function's context
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getComments(postId, page, limit);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch comments",
      },
      { status: 400 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    const userId = decoded.userId; // Corrected from decoded.id

    const { id } = await params;
    const postId = parseInt(id);
    const body = await request.json();

    const comment = await createComment(userId, postId, body);
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create comment",
      },
      {
        status:
          error instanceof Error && error.message === "Post not found"
            ? 404
            : 400,
      }
    );
  }
}