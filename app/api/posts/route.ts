/*
import { NextResponse } from "next/server";

// for fronend dummy datas

const posts = [
  {
    id: 1,
    name: "Jane Smith",
    username: "janesmith",
    time: "2h",
    ProfileImage: "/images/avatar1.png",
    content: "Just launched my new portfolio!  #webdesign #portfolio",
    image: "/images/avatar1.png",
    likes: 24,
    comments: 5,
    shares: 2,
    following: false,
  },
  {
    id: 2,
    name: "Alex Johnson",
    username: "alexj",
    time: "4h",
    ProfileImage: "/images/avatar2.png",
    content: "Working on some exciting new features! Stay tuned",
    image: "/images/avatar1.png",
    likes: 10,
    comments: 1,
    shares: 0,
    following: false,
  },
  {
    id: 3,
    name: "Emily Davis",
    username: "emilyd",
    time: "1d",
    ProfileImage: "/images/avatar2.png",
    content: "Designing new UI concepts",
    image: "/images/avatar2.png",
    likes: 40,
    comments: 6,
    shares: 4,
    following: false,
  },
  {
    id: 4,
    name: "Jane Smith",
    username: "janesmith",
    time: "2h",
    ProfileImage: "/images/avatar1.png",
    content: "Just launched my new portfolio! #webdesign #portfolio",
    image: "/images/avatar1.png",
    likes: 24,
    comments: 5,
    shares: 2,
    following: false,
  },
  {
    id: 5,
    name: "Alex Johnson",
    username: "alexj",
    time: "4h",
    ProfileImage: "/images/avatar2.png",
    content: "Working on some exciting new features! Stay tuned ",
    image: "/images/avatar1.png",
    likes: 10,
    comments: 1,
    shares: 0,
    following: false,
  },
  {
    id: 6,
    name: "Emily Davis",
    username: "emilyd",
    time: "1d",
    ProfileImage: "/images/avatar2.png",
    content: "Designing new UI concepts",
    image: "/images/avatar2.png",
    likes: 40,
    comments: 6,
    shares: 4,
    following: false,
  },
  {
    id: 7,
    name: "Jane Smith",
    username: "janesmith",
    time: "2h",
    ProfileImage: "/images/avatar1.png",
    content: "Just launched my new portfolio!  #webdesign #portfolio",
    image: "/images/avatar1.png",
    likes: 24,
    comments: 5,
    shares: 2,
    following: true,
  },
  {
    id: 8,
    name: "Alex Johnson",
    username: "alexj",
    time: "4h",
    ProfileImage: "/images/avatar2.png",
    content: "Working on some exciting new features! Stay tuned",
    image: "/images/avatar1.png",
    likes: 10,
    comments: 1,
    shares: 0,
    following: false,
  },
  {
    id: 9,
    name: "Emily Davis",
    username: "emilyd",
    time: "1d",
    ProfileImage: "/images/avatar2.png",
    content: "Designing new UI concepts",
    image: "/images/avatar2.png",
    likes: 40,
    comments: 6,
    shares: 4,
    following: false,
  },
];

export async function GET() {
  return NextResponse.json(posts);
}
*/
import {  NextResponse } from "next/server";
import { createPost } from "@/services/posts/create";
import { getPosts } from "@/services/posts/manage";
import { verifyToken } from "@/lib/auth";
import { z } from 'zod';


const postSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().url().optional(),
});

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
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId } = verifyToken(token);
    const body = await req.json();
    const { content, imageUrl } = postSchema.parse(body);

    const post = await createPost(userId, content, imageUrl);
    return NextResponse.json({ message: "Post created successfully", post }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

