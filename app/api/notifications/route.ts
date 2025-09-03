import { NextRequest, NextResponse } from "next/server";
import { fetchNotifications } from "@/services/notifications/fetch";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    const notifications = await fetchNotifications(payload.userId);

    return NextResponse.json(notifications);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
