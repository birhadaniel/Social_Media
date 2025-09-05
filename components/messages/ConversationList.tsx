'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Conversation {
  id: string;
  user: {
    id: number;
    username: string;
    profilePicture: string;
  };
  lastMsg: {
    content: string;
    createdAt: Date;
  };
}

export default function ConversationList({
  onSelectChat,
}: {
  onSelectChat: (id: string) => void;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) {
          console.log('No token or userId found, skipping inbox fetch. userId:', userId, 'token:', token ? 'present' : 'missing');
          setLoading(false);
          return;
        }

        console.log('Frontend - Starting inbox fetch for userId:', userId, 'with token:', token.substring(0, 5) + '...');
        const response = await fetch('/api/messages', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Frontend - Received response status:', response.status);
        const text = await response.text();
        console.log('Frontend - Received response text:', text);
        if (response.ok) {
          const data = text ? JSON.parse(text) : {};
          console.log('Frontend - Parsed data:', data);
          if (data.success && data.data) {
            setConversations(data.data);
          } else {
            setConversations([]);
            console.log('Frontend - No valid data in response:', data);
          }
        } else {
          console.error('Failed to fetch inbox:', response.status, text);
          setConversations([]);
        }
      } catch (error) {
        console.error('Error fetching inbox:', error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userId]); // Re-fetch if userId changes

  if (loading) {
    return (
      <div className="h-full overflow-y-auto bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading inbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-black">
      <Link href="/feed">
        <h2 className="p-4 text-lg font-bold border-b border-gray-800 cursor-pointer">
          Inbox
        </h2>
      </Link>
      
      {conversations.length === 0 ? (
        <div className="p-4 text-center text-gray-400">
          <p>No conversations in inbox yet</p>
        </div>
      ) : (
        conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectChat(c.id)}
            className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-800 transition"
          >
            <Image
              src={c.user.profilePicture || '/default-avatar.png'}
              alt={`${c.user.username}'s avatar`}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium">{c.user.username}</p>
              <p className="text-gray-400 text-sm truncate">{c.lastMsg.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}