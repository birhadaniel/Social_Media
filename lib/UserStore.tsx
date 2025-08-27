"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type User = {
  id: string;
  username: string;
  name: string;
  bio?: string;
  avatar: string;
  followers: number;
  following: number;
  isMe? :boolean;
};

type Store = {
  users: Record<string, User>;
  updateUser: (id: string, data: Partial<User>) => void;
};

const UserContext = createContext<Store | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<Record<string, User>>({
    "123": {
      id: "123",
      username: "you",
      name: "You",
      bio: "Building a social app ✨",
      avatar: "/images/avatar2.png",
      followers: 321,
      following: 180,
      isMe : true,
    },
    "456": {
      id: "456",
      username: "james_smith",
      name: "James Smith",
      bio: "Full-stack dev 🌍 | Coffee ☕ | Music 🎶",
      avatar: "/images/avatar2.png",
      followers: 120,
      following: 80,
    },
  });

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...data },
    }));
  };

  return (
    <UserContext.Provider value={{ users, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserStore() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserStore must be inside UserProvider");
  return ctx;
}
