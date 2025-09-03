import { NextRequest, NextResponse } from "next/server";
import { uploadMedia } from "@/services/media/upload";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);

    // For simplicity, expecting frontend to send { url, type } in JSON body
    const { url, type } = await req.json();
    if (!url || !type) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const media = await uploadMedia({ url, type, userId: payload.userId });
    return NextResponse.json({ success: true, media });
  } catch (err) {
    return NextResponse.json({ error: "Media upload failed" }, { status: 500 });
  }
}
