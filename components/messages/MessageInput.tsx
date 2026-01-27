"use client";
import { useState } from "react";
import { Send } from "lucide-react";

export default function MessageInput({
  onSend,
}: {
  onSend: (msg: string) => void;
}) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="flex items-center p-3 border-t border-gray-800 bg-gray-850">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 rounded-lg bg-gray-700 text-white outline-none"
      />
      <button
        onClick={handleSend}
        className="ml-2 p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition"
      >
        <Send className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
