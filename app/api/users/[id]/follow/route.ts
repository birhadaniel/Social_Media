import { NextResponse } from "next/server";
import { followUser, unfollowUser } from "@/services/users/userService";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    const followingId = parseInt(params.id);
    const follow = await followUser(payload.userId, followingId);

    return NextResponse.json(follow);
  } catch {
    return NextResponse.json({ error:"server errors" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    const followingId = parseInt(params.id);
    await unfollowUser(payload.userId, followingId);

    return NextResponse.json({ message: "Unfollowed successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to unfollow" }, { status: 400 });
  }
}
