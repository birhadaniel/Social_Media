"use client";

import { useParams } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePosts, { Post } from "@/components/profile/ProfilePosts";
import Sidebar from "@/components/ui/Sidebar";
import BottomNav from "@/components/ui/BottomNav";
import { useUser } from "@/hooks/useUser";


export default function ProfilePage({params }:{params: {id: string}}) {
  const userId = Number(params.id);
  const { user, loading, error } =
    !isNaN(userId) ? useUser(userId) : { user: null, loading: false, error: "Invalid user ID" };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!userId) return <p className="text-red-500">Please log in to view your profile</p>;
  if (!user) return <p className="text-red-500">User not found</p>;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="sm:ml-60 flex justify-center">
        <div className="w-full max-w-2xl px-2 pt-6 pb-20">
          <ProfileHeader user={user} />
          {/* <div className="mt-6">
            <ProfilePosts posts={posts} />
          </div> */}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
