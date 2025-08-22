"use client";

import { Home, Search, Bell, Mail, User, PlusCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/feed", label: "Home", icon: Home },
  { href: "/search", label: "Explore", icon: Search },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/profile", label: "Profile", icon: User },
];

type Props = { onCompose?: () => void };

export default function Sidebar({ onCompose }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden sm:flex flex-col w-60 h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-6">
      <Link
        href="/feed"
        className="text-2xl font-bold text-sky-500 mb-6 focus:outline-none"
      >
        SocialApp
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl focus:outline-none ${
                active
                  ? "bg-sky-100 text-sky-600 dark:bg-sky-800 dark:text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2">
        <button
          onClick={() => onCompose?.()}
          className="w-full flex items-center justify-center bg-sky-700 hover:bg-sky-600 text-white px-4 py-2 rounded-full font-semibold focus:outline-none cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Post
        </button>

        <Link
          href="/"
          className="w-full flex items-center justify-center px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log out
        </Link>
      </div>
    </aside>
  );
}
