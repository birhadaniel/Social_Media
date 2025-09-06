import { User, Post, Comment, Notification } from './types';

const API_URL = '/api';

const getToken = () => localStorage.getItem('token');

interface ApiErrorResponse {
  error?: string;
}

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, { ...options, headers });

  // Handle successful responses that might not have a body (e.g., 204 No Content)
  if (response.status === 204) {
    return null; // Return null for no content
  }

  // Handle non-ok responses first
  if (!response.ok) {
    // Attempt to parse JSON error, but fall back if it fails
    let errorData: ApiErrorResponse = {};
    try {
      errorData = await response.json();
    } catch (e) {
      // If JSON parsing fails, the response might be plain text or empty
      throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    }
    throw new Error(errorData.error || 'Request failed');
  }

  // Now, try to parse the JSON for successful responses
  try {
    return response.json();
  } catch (e) {
    // This is the key change: Catch the JSON parsing error here.
    // If the response is successful but has no content, return null.
    throw new Error('Failed to parse JSON response. The server may have sent an empty body.');
  }
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
  const response = await fetchWithAuth(`/users/${id}`);
  if (!response) {
    throw new Error('User data not found.');
  }
  return response as User;
};

export const updateUser = async (id: number, data: { username?: string; bio?: string}): Promise<User> => {
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