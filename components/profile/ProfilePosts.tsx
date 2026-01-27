"use client";

import PostCard from "@/components/feed/PostCard";

export type Post = {
  id: string;
  name: string;
  username: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
};

export default function ProfilePosts({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        No posts yet.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <PostCard key={p.id} {...p} />
      ))}
    </div>
  );
}
