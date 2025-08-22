import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatWindow({
  //chatId,
  onBack,
}: {
  chatId: string;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! How are you?", isSender: false, time: "10:30 AM" },
    { id: 2, text: "I’m good, thanks! You?", isSender: true, time: "10:31 AM" },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = (msg: string) => {
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, text: msg, isSender: true, time: "Now" },
    ]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800 bg-gray-850">
        {/* Show back button only on mobile */}
        <button onClick={onBack} className="md:hidden">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <Image
          src="/images/avatar1.png"
          alt="Alice avatar"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />

        <div>
          <p className="text-white font-medium">Alice</p>
          <p className="text-gray-400 text-xs">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <MessageBubble key={m.id} {...m} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} />
    </div>
  );
}
