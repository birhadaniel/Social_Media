
import { User, Post, Comment, Notification } from './type';

const API_URL = '/api';

const getToken = () => localStorage.getItem('token');

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
};

export const register = async (data: { email: string; username: string; password: string }) => {
  return fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const login = async (data: { email: string; password: string }) => {
  return fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const resetPassword = async (data: { email: string }) => {
  return fetchWithAuth('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getUser = async (id: number): Promise<User> => {
  return fetchWithAuth(`/users/${id}`);
};

export const updateUser = async (id: number, data: { bio?: string; profilePicture?: string }): Promise<User> => {
  return fetchWithAuth(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const followUser = async (id: number) => {
  return fetchWithAuth(`/users/${id}/follow`, { method: 'POST' });
};

export const unfollowUser = async (id: number) => {
  return fetchWithAuth(`/users/${id}/follow`, { method: 'DELETE' });
};

export const checkFollowStatus = async (id: number): Promise<{ isFollowing: boolean }> => {
  return fetchWithAuth(`/users/${id}/follow`);
};

export const getFollowers = async (id: number): Promise<User[]> => {
  return fetchWithAuth(`/users/${id}/followers`);
};

export const createPost = async (data: { content?: string; mediaUrls?: string[] }): Promise<Post> => {
  return fetchWithAuth('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getFeed = async (): Promise<Post[]> => {
  return fetchWithAuth('/posts/feed');
};

export const likePost = async (postId: number) => {
  return fetchWithAuth(`/interactions/${postId}/like`, { method: 'POST' });
};

export const commentOnPost = async (postId: number, content: string): Promise<Comment> => {
  return fetchWithAuth(`/interactions/${postId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
};

export const getNotifications = async (): Promise<Notification[]> => {
  return fetchWithAuth('/notifications');
};