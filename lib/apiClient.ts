import { User, Post, Comment } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  success?: boolean;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = {
        ...this.defaultHeaders,
        ...this.getAuthHeaders(),
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
          }
          throw new Error('Authentication required');
        }

        if (response.status === 429 && retryCount < MAX_RETRIES) {
          await this.delay(RETRY_DELAY * Math.pow(2, retryCount));
          return this.request<T>(endpoint, options, retryCount + 1);
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (retryCount < MAX_RETRIES && this.isRetryableError(error)) {
        await this.delay(RETRY_DELAY * Math.pow(2, retryCount));
        return this.request<T>(endpoint, options, retryCount + 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.name === 'TypeError' || error.message.includes('fetch');
    }
    
    if (typeof error === 'object' && error !== null && 'status' in error) {
      const statusError = error as { status: number };
      return statusError.status >= 500 && statusError.status < 600;
    }
    
    return false;
  }

  // Auth methods
  async register(data: { email: string; username: string; password: string }) {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // User methods
  async getUser(id: number) {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(id: number, data: Partial<User>) {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Post methods
  async createPost(data: { content?: string; mediaUrls?: string[] }) {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFeed(page = 1, limit = 10) {
    return this.request<{ posts: Post[]; total: number; page: number; limit: number }>(
      `/posts/feed?page=${page}&limit=${limit}`
    );
  }

  // Interaction methods
  async likePost(postId: number) {
    return this.request<{ message: string }>(`/posts/${postId}/likes`, {
      method: 'POST',
    });
  }

  async commentOnPost(postId: number, content: string) {
    return this.request<Comment>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
