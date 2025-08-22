import Link from "next/link";
import Image from "next/image";

export default function ConversationList({
  onSelectChat,
}: {
  onSelectChat: (id: string) => void;
}) {
  const conversations = [
    {
      id: "1",
      name: "Alice",
      lastMsg: "See you later",
      avatar: "/images/avatar1.png",
    },
    {
      id: "2",
      name: "Bob",
      lastMsg: "Did you finish?",
      avatar: "/images/avatar2.png",
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-black">
      <Link href="/feed">
        <h2 className="p-4 text-lg font-bold border-b border-gray-800 cursor-pointer">
          Messages
        </h2>
      </Link>
      {conversations.map((c) => (
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
      ))}
    </div>
  );
}
