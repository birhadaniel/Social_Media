import { NextRequest, NextResponse } from "next/server";
import { triggerNotification } from "@/services/notifications/trigger";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

const triggerSchema = z.object({
  userId: z.number().int().positive(),
  type: z.enum(["LIKE", "COMMENT", "FOLLOW", "MESSAGE"]),
  postId: z.number().int().positive().optional(),
  commentId: z.number().int().positive().optional(),
  messageId: z.number().int().positive().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    console.log("Received Token:", token);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    console.log("Payload:", payload);
    const body = await req.json();
    console.log("Body:", body);
    const { userId, type, postId, commentId, messageId } = triggerSchema.parse(body);

    const notification = await triggerNotification({
      userId,
      triggeredById: payload.userId,
      type,
      postId,
      commentId,
      messageId,
    });

    return NextResponse.json({ success: true, notification });
  } catch (error: unknown) {
    console.error("Error triggering notification:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to trigger notification" }, { status: 500 });
  }
}