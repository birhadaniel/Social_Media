"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/Sidebar";
import BottomNav from "@/components/ui/BottomNav";
import Navbar from "@/components/ui/Navbar";
import FeedTabs from "@/components/feed/FeedTabs";
import PostCard from "@/components/feed/PostCard";
import PostModal from "@/components/feed/PostModal";

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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, skipping posts fetch');
          setLoading(false);
          return;
        }

        const res = await fetch("/api/posts/feed?limit=10", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setPosts(data.data.posts || []);
          } else {
            setPosts([]);
          }
        } else {
          console.error("Failed to fetch posts", res.status);
          setPosts([]);
        }
      } catch (err) {
        console.error("Failed to fetch posts", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handlePost = async (newPost: { content: string; media?: string }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newPost.content,
          mediaUrls: newPost.media ? [newPost.media] : [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Refresh posts after successful creation
          const refreshResponse = await fetch("/api/posts/feed?limit=10", {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.success && refreshData.data) {
              setPosts(refreshData.data.posts || []);
            }
          }
        }
      } else {
        console.error('Failed to create post:', response.status);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const filteredPosts =
    activeTab === "following"
      ? posts.filter((post) => post.following === true)
      : posts;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Sidebar with Post Button */}
      <Sidebar onCompose={() => setShowModal(true)} />

      <main className="sm:ml-60 flex justify-center">
        <div className="w-full max-w-2xl px-2 pt-6 pb-20">
          <Navbar onCompose={() => setShowModal(true)} />

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
                  No posts to show here
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <BottomNav />

      {/* Modal */}
      {showModal && (
        <PostModal onClose={() => setShowModal(false)} onPost={handlePost} />
      )}
    </div>
  );
}
