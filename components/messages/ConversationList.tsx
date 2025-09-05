'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Conversation {
  id: string;
  name: string;
  lastMsg: string;
  avatar?: string;
}

export default function ConversationList({
  onSelectChat,
}: {
  onSelectChat: (id: string) => void;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, skipping conversations fetch');
          setLoading(false);
          return;
        }

        console.log('Frontend - Sending request with token:', token ? 'Present' : 'Missing');
        console.log('Frontend - Token length:', token?.length);
        
        const response = await fetch('/api/messages/conversations', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Frontend - Response status:', response.status);
        console.log('Frontend - Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setConversations(data.data);
          } else {
            setConversations([]);
          }
        } else {
          console.error('Failed to fetch conversations:', response.status);
          setConversations([]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) {
    return (
      <div className="h-full overflow-y-auto bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-black">
      <Link href="/feed">
        <h2 className="p-4 text-lg font-bold border-b border-gray-800 cursor-pointer">
          Messages
        </h2>
      </Link>
      
      {conversations.length === 0 ? (
        <div className="p-4 text-center text-gray-400">
          <p>No conversations yet</p>
        </div>
      ) : (
        conversations.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelectChat(c.id)}
          className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-800 transition"
        >
          <Image
            src={c.avatar}
            alt={`${c.name}'s avatar`}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <p className="font-medium">{c.name}</p>
            <p className="text-gray-400 text-sm truncate">{c.lastMsg}</p>
          </div>
        </div>
        ))
      )}
    </div>
  );
}
