"use client";

import {
  Menu,
  Home,
  Search,
  Bell,
  Mail,
  User,
  PlusCircle,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Menu items with icons
  const menuItems = [
    { href: "/feed", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Search },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/messages", label: "Messages", icon: Mail },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/create", label: "Create Post", icon: PlusCircle },
    { href: "/", label: "Logout", icon: LogOut },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 sm:hidden">
      {/* Logo */}
      <Link href="/feed" className="text-xl font-bold text-sky-500">
        SocialApp
      </Link>

      {/* Hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-expanded={open}
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setOpen(false)}
          />

          <nav className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 rounded-b-lg mx-2 overflow-hidden">
            <ul className="flex flex-col py-2">
              {menuItems.map((item, index) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                      index === menuItems.length - 2
                        ? "border-b border-gray-200 dark:border-gray-800"
                        : ""
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
