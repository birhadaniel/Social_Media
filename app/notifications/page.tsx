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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, skipping notifications fetch');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setNotifications(data.data);
          } else {
            // Fallback to empty array if no notifications
            setNotifications([]);
          }
        } else {
          console.error('Failed to fetch notifications:', response.status);
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
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

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="sm:ml-60 flex justify-center">
        <div className="w-full max-w-2xl pb-20">
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sm:hidden">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Notifications
            </h1>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <h1 className="hidden sm:block text-xl font-bold text-gray-900 dark:text-white mt-4 mb-4 px-2">
            Notifications
          </h1>

          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
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
                          src={n.avatar || "/images/avatar1.png"}
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
            ))
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
