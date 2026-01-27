"use client";

import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

interface Post {
  id: number;
  content: string;
  createdAt: string;
  mediaUrls: string[] | null;
  likesCount: number;
  commentsCount: number;
  author: {
    username: string;
    profilePicture: string | null;
  } | null;
}

interface UserPostsProps {
  posts: Post[];
}

const UserPosts = ({ posts }: UserPostsProps) => {
  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm">
                {post.author && post.author.profilePicture ? (
                  <img src={post.author.profilePicture} alt={post.author.username} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  post.author?.username?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{post.author?.username || 'Unknown User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{post.likesCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.commentsCount}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No posts found for this user.</p>
        </div>
      )}
    </div>
  );
};

export default UserPosts;