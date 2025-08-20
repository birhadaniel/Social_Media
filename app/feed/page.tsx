"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/Sidebar";
import BottomNav from "@/components/ui/BottomNav";
import Navbar from "@/components/ui/Navbar";
import FeedTabs from "@/components/feed/FeedTabs";
import PostCard from "@/components/feed/PostCard";

interface Post {
  id: string;
  name: string;
  username: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  following?: boolean;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("http://localhost:3000/api/posts?limit=10", {
          cache: "no-store",
        });
        const data: Post[] = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts =
    activeTab === "following"
      ? posts.filter((post) => post.following === true)
      : posts;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* desktop */}
      <Sidebar />

      <main className="sm:ml-60 flex justify-center">
        <div className="w-full max-w-2xl px-2 pt-6 pb-20">
          {/* MObile  */}
          <Navbar />

          <div className="sticky top-0 z-40 bg-gray-50 dark:bg-gray-950 pt-2 pb-3 border-b border-gray-200 dark:border-gray-800">
            <FeedTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {loading ? (
            <p className="text-center text-gray-500 mt-4">Loading posts...</p>
          ) : (
            <div className="mt-4 space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))
              ) : (
                <p className="text-center text-gray-500 mt-4">
                  No posts to show here 👀
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* MObile */}
      <BottomNav />
    </div>
  );
}
