"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, MessageCircle, Heart } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import BottomNav from "@/components/ui/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface PostAuthor {
  username: string;
}

interface UserSearchResult {
  id: string;
  type: "user";
  name?: string;
  username?: string;
  bio?: string;
  avatar?: string;
  isFollowing?: boolean;
  hasConversation?: boolean;
}

interface PostSearchResult {
  id: string;
  type: "post";
  content?: string;
  author?: PostAuthor;
}

type SearchResult = UserSearchResult | PostSearchResult;

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      console.log('SearchPage - Fetching search results for query:', query);
      
      try {
        const token = localStorage.getItem('token');
        console.log('SearchPage - Token present:', token ? 'Yes' : 'No');
        if (!token) {
          console.error('SearchPage - No token found in Local Storage');
          setResults([]);
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('SearchPage - Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('SearchPage - Response data:', data);
          if (data.success && data.data) {
            setResults(data.data);
          } else {
            setResults([]);
          }
        } else {
          console.error(`SearchPage - Search failed with status: ${response.status}`);
          setResults([]);
        }
      } catch (error) {
        console.error('SearchPage - Search network error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleFollow = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('SearchPage - No token for follow action');
        return;
      }

      console.log('SearchPage - Sending follow request for userId:', userId);
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('SearchPage - Follow successful for userId:', userId);
        setResults(prev => prev.map(item => 
          item.id === userId && item.type === 'user' 
            ? { ...item, isFollowing: true }
            : item
        ));
      } else {
        console.error('SearchPage - Follow failed with status:', response.status);
      }
    } catch (error) {
      console.error('SearchPage - Follow error:', error);
    }
  };

  const handleStartConversation = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('SearchPage - No token for start conversation');
        return;
      }

      console.log('SearchPage - Starting conversation with userId:', userId);
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: parseInt(userId),
          content: "Hello! I'd like to start a conversation.",
        }),
      });

      if (response.ok) {
        console.log('SearchPage - Conversation started with userId:', userId);
        setResults(prev => prev.map(item => 
          item.id === userId && item.type === 'user' 
            ? { ...item, hasConversation: true }
            : item
        ));
        window.location.href = '/messages';
      } else {
        console.error('SearchPage - Start conversation failed with status:', response.status);
      }
    } catch (error) {
      console.error('SearchPage - Start conversation error:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('SearchPage - No token for like post');
        return;
      }

      console.log('SearchPage - Liking postId:', postId);
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('SearchPage - Post liked successfully, postId:', postId);
      } else {
        console.error('SearchPage - Like failed with status:', response.status);
      }
    } catch (error) {
      console.error('SearchPage - Like error:', error);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="sm:ml-60 flex justify-center">
        <div className="w-full max-w-2xl px-4 pt-6 pb-20">
          {/* Search Bar */}
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 shadow-sm sticky top-0 z-40">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users or posts... (type at least 2 characters)"
              className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-200"
            />
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-600"></div>
            )}
          </div>

          {/* Results */}
          <div className="mt-6 space-y-4">
            {results.length > 0 ? (
              results.map((item) =>
                item.type === "user" ? (
                  <Link href={`/profile/${item.id}`} key={item.id}>
                    <div
                      className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-900 shadow hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-lg">
                          {item.avatar ? (
                            <img 
                              src={item.avatar} 
                              alt={item.name} 
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            item.name?.[0]?.toUpperCase() || 'U'
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.username}
                          </p>
                          {item.bio && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {item.bio}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!item.isFollowing ? (
                          <span 
                            className="flex items-center space-x-1 px-3 py-1 bg-sky-600 text-white rounded-full text-sm cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              handleFollow(item.id);
                            }}
                          >
                            <UserPlus className="w-4 h-4" />
                            <span>Follow</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                            Following
                          </span>
                        )}
                        {!item.hasConversation ? (
                          <span 
                            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-full text-sm cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              handleStartConversation(item.id);
                            }}
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Message</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                            Has Conversation
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Post by {item.author?.username}
                      </p>
                      <button
                        onClick={() => handleLikePost(item.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Like</span>
                      </button>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">
                      {item.content}
                    </p>
                  </div>
                )
              )
            ) : query && !loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {query.length < 2 
                    ? "Type at least 2 characters to search..." 
                    : `No results found for "${query}"`
                  }
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Start typing to search for users and posts
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  You can follow users, start conversations, and like posts
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}