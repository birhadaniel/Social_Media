// lib/validators.ts
import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const updateUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
});
export const followSchema = z.object({
  followedId: z.number().int().positive(),
});
export const followerSchema = z.object({
  followerId: z.number().int().positive(),
});

export const profileSchema = z.object({
  bio: z.string().optional(),
  profilePicture: z.string().url().optional(),
});

export const createPostSchema = z.object({
  content: z.string().max(280, 'Content cannot exceed 280 characters').optional(),
  mediaUrls: z.array(z.string().url('Invalid URL')).optional(),
});
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(280, 'Content cannot exceed 280 characters'),
});