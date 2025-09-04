export interface User {
  id: number;
  username: string;
  email?: string;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
}

export interface Post {
  id: number;
  userId: number;
  user: { id: number; username: string; profilePicture?: string };
  content?: string;
  mediaUrls: string[];
  likesCount: number;
  createdAt: string;
  comments: Comment[];
  likes: { id: number; userId: number }[];
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  user: { id: number; username: string; profilePicture?: string };
  content: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  triggeredById: number;
  triggeredBy: { id: number; username: string; profilePicture?: string };
  postId?: number;
  post?: Post;
  commentId?: number;
  comment?: Comment;
  createdAt: string;
}