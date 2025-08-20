import { NextResponse } from "next/server";
import { getFollowers } from "@/services/users/userService";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const followers = await getFollowers(id);
    return NextResponse.json(followers);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 });
  }
}
