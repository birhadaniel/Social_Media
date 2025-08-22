"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, UserPlus, MoreHorizontal } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import BottomNav from "@/components/ui/BottomNav";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow";
  user: string;
  avatar?: string;
  message: string;
  time: string;
  group: "Today" | "This Week" | "Earlier";
  unread?: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const mock: Notification[] = [
      {
        id: "1",
        type: "like",
        user: "Alice",
        avatar: "/images/avatar1.png",
        message: "liked your post ",
        time: "2m ago",
        group: "Today",
        unread: true,
      },
      {
        id: "2",
        type: "comment",
        user: "Bob",
        avatar: "/images/avatar1.png",
        message: "commented: “Nice work!” ",
        time: "10m ago",
        group: "Today",
      },
      {
        id: "3",
        type: "follow",
        user: "Charlie",
        avatar: "/images/avatar1.png",
        message: "started following you ",
        time: "1h ago",
        group: "This Week",
      },
    ];
    setNotifications(mock);
  }, []);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return (
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100 text-red-500">
            <Heart className="w-4 h-4" />
          </div>
        );
      case "comment":
        return (
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-sky-100 text-sky-500">
            <MessageCircle className="w-4 h-4" />
          </div>
        );
      case "follow":
        return (
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 text-green-500">
            <UserPlus className="w-4 h-4" />
          </div>
        );
    }
  };

  const grouped = notifications.reduce((acc, n) => {
    if (!acc[n.group]) acc[n.group] = [];
    acc[n.group].push(n);
    return acc;
  }, {} as Record<string, Notification[]>);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Sidebar for desktop */}
      <Sidebar />

      <main className="sm:ml-60 flex justify-center">
        <div className="w-full max-w-2xl pb-20">
          {/*Mobile Top Bar*/}
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sm:hidden">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Notifications
            </h1>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Desktop */}
          <h1 className="hidden sm:block text-xl font-bold text-gray-900 dark:text-white mt-4 mb-4 px-2">
            Notifications
          </h1>

          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-14 px-2">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                {group}
              </h2>
              <div className="space-y-3">
                {items.map((n) => (
                  <Link
                    key={n.id}
                    href={
                      n.type === "follow"
                        ? `/profile/${n.user}`
                        : `/post/${n.id}`
                    }
                  >
                    <div
                      className={`flex items-center mb-3 gap-4 p-4 rounded-2xl shadow-md transition hover:scale-[1.01] cursor-pointer
          ${
            n.unread
              ? "bg-sky-50 dark:bg-gray-700"
              : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
                    >
                      <Image
                        src={n.avatar || "./image/avatar2.png"}
                        alt={n.user}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />

                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            n.unread
                              ? "font-semibold text-gray-900 dark:text-white"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          <span className="font-semibold">{n.user}</span>{" "}
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-500">{n.time}</p>
                      </div>

                      {getIcon(n.type)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
