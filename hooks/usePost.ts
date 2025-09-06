'use client';

import { useState, useEffect } from 'react';
import { createPost, getFeed, likePost, commentOnPost } from '@/lib/api';
import { Post, Comment } from '@/lib/types';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const feed = await getFeed();
        setPosts(feed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async (data: { content?: string; mediaUrls?: string[] }) => {
    setLoading(true);
    setError(null);
    try {
      const newPost = await createPost(data);
      setPosts([newPost, ...posts]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId: number) => {
    setLoading(true);
    setError(null);
    try {
      await likePost(postId);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likesCount: post.likesCount + 1, likes: [...post.likes, { id: Date.now(), userId: 0 }] } 
          : post
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like post');
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (postId: number, content: string) => {
    setLoading(true);
    setError(null);
    try {
      const newComment = await commentOnPost(postId, content);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, newComment] } 
          : post
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to comment');
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, error, handleCreatePost, handleLikePost, handleComment };
};