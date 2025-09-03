import { NextRequest, NextResponse } from "next/server";
import { triggerNotification } from "@/services/notifications/trigger";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    const { userId, type, message } = await req.json();

    const notification = await triggerNotification({ userId, type, message });
    return NextResponse.json({ success: true, notification });
  } catch (err) {
    return NextResponse.json({ error: "Failed to trigger notification" }, { status: 500 });
  }
}
