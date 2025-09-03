import { NextRequest, NextResponse } from "next/server";
import { uploadMedia } from "@/services/media/upload";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    console.log("Token:", token);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let payload;
    try {
      payload = verifyToken(token);
      console.log("Payload:", payload); // Debug
      if (!payload.userId) throw new Error("Invalid token payload: userId missing");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid token";
     return NextResponse.json({ error: `Unauthorized: ${errorMessage}` }, { status: 401 });
    }

    const body = await req.json();
    console.log("Request body:", body); 
    const { url, type } = body;
    if (!url || !type || !["image", "video"].includes(type)) {
      return NextResponse.json({ error: "Invalid or missing fields" }, { status: 400 });
    }
 const media = await uploadMedia({ url, type, userId: payload.userId });
    console.log("Media response:", media); 
    return NextResponse.json({ success: true, media });
  } catch (err) {
    console.error("Error in POST /api/upload:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Media upload failed: ${errorMessage}` }, { status: 500 });
  }
}