import { NextResponse } from "next/server";
import { getUserById, updateUser } from "@/services/users/userService";
import { updateUserSchema } from "@/lib/validators";

export async function GET(erq: Request, context: { params: { id: string } }) {
  const { params } = await context;
  const id = parseInt(params.id);
  const user = await getUserById(id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    
    const validated = updateUserSchema.parse(body);
    const updated = await updateUser(id, validated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}
