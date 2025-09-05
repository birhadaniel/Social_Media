import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useAuth } from "@/hooks/useAuth";

export default function ChatWindow({
  chatId,
  onBack,
}: {
  chatId: string;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("Unknown User");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId || !userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/messages?conversation=${chatId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          const formattedMessages = (data.data || []).map((m: any) => ({
            id: m.id,
            text: m.content,
            isSender: m.senderId === userId,
            time: new Date(m.createdAt).toLocaleTimeString(),
          }));
          setMessages(formattedMessages);

          // Extract username from the first message's sender or receiver
          if (formattedMessages.length > 0) {
            const firstMessage = data.data[0];
            const otherUser = firstMessage.senderId === userId ? firstMessage.receiver : firstMessage.sender;
            setUsername(otherUser?.username || "Unknown User");
          }
        } else {
          console.error('Failed to fetch messages:', response.status, await response.text());
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      if (!chatId) return;
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching user for chatId:', chatId, 'with token:', token ? 'present' : 'missing');
        const response = await fetch(`/api/users/${chatId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log('User fetch response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('User fetch response data:', data);
          setUsername(data.data?.username || data.data?.name || "Unknown User"); // Try username or name
        } else {
          console.error('User fetch failed:', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchMessages();
    fetchUser();
  }, [chatId, userId]);

  const handleSend = async (msg: string) => {
    if (!chatId || !userId) return;
    const token = localStorage.getItem('token');
    try {
      console.log('Sending message:', { receiverId: chatId, content: msg }, 'with token:', token ? 'present' : 'missing');
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: parseInt(chatId), // Ensure chatId is an integer
          content: msg,
        }),
      });
      console.log('Send response status:', response.status);
      const text = await response.text();
      console.log('Send response text:', text);
      const data = text ? JSON.parse(text) : {};
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.data.id,
            text: msg,
            isSender: true,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        console.error('Failed to send message:', response.status, text);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800 bg-gray-850">
        <button onClick={onBack} className="md:hidden">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <Image
          src="/images/avatar1.png"
          alt={`${username} avatar`}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
          onError={(e) => { e.currentTarget.src = '/images/default-avatar.png'; }}
        />
        <div>
          <p className="text-white font-medium">{username}</p>
          <p className="text-gray-400 text-xs">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="text-center text-gray-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400">No messages yet</div>
        ) : (
          messages.map((m) => (
            <MessageBubble key={m.id} text={m.text} isSender={m.isSender} time={m.time} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} />
    </div>
  );
}