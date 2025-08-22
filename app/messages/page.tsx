"use client";
import { useState } from "react";
import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";
import BottomNav from "@/components/ui/BottomNav";

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-950 text-white">
      {/* Sidebar*/}
      <div
        className={`w-full md:w-1/3 ${
          activeChat ? "hidden md:block" : "block"
        }`}
      >
        <ConversationList onSelectChat={setActiveChat} />
      </div>

      {/* Chat window */}
      <div className={`flex-1 ${activeChat ? "block" : "hidden md:block"}`}>
        {activeChat ? (
          <ChatWindow chatId={activeChat} onBack={() => setActiveChat(null)} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
