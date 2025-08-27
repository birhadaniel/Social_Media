"use client";

import { useParams } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePosts, { Post } from "@/components/profile/ProfilePosts";
import Sidebar from "@/components/ui/Sidebar";
import BottomNav from "@/components/ui/BottomNav";
import { useUserStore } from "@/lib/UserStore"; 

const MOCK_POSTS: Record<string, Post[]> = {
  "123": [
    {
      id: "p1",
      name: "You",
      username: "you",
      time: "2h",
      content: "Shipping new features today 🚀",
      image: "/images/avatar1.png",
      likes: 24,
      comments: 5,
      shares: 2,
    },
  ],
  "456": [
    {
      id: "p2",
      name: "James Smith",
      username: "james_smith",
      time: "1d",
      content: "Weekend vibes 🌴",
      image: "/images/avatar2.png",
      likes: 50,
      comments: 12,
      shares: 4,
    },
  ],
};

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { users } = useUserStore(); //get from global store
  const user = users[id] ?? users["456"]; // fallback 
  const posts = MOCK_POSTS[id] ?? [];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="sm:ml-60 flex justify-center">
        <div className="w-full max-w-2xl px-2 pt-6 pb-20">
          <ProfileHeader user={user} />
          <div className="mt-6">
            <ProfilePosts posts={posts} />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
