"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type ProfileUser = {
  id: string;
  username: string;
  name: string;
  bio?: string;
  avatar: string;
  followers: number;
  following: number;
  isMe?: boolean;
  isFollowing?: boolean;
};

type Props = {
  user: ProfileUser;
  onToggleFollow?: (next: boolean) => void;
};

export default function ProfileHeader({ user, onToggleFollow }: Props) {
  const [following, setFollowing] = useState(!!user.isFollowing);

  const handleFollow = () => {
    const next = !following;
    setFollowing(next);
    onToggleFollow?.(next);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Cover */}
      <div className="h-28 bg-gradient-to-r from-sky-500 to-indigo-600" />

      <div className="px-4 pb-4 -mt-10">
        <div className="flex items-end gap-4">
          <Image
            src={user.avatar}
            alt={user.name}
            width={96}
            height={96}
            className="rounded-full border-4 border-white dark:border-gray-900 shadow-md"
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
          </div>

          {/* Action */}
          {user.isMe ? (
            <Link
              href="/profile/edit"
              className="px-4 py-2 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              Edit Profile
            </Link>
          ) : (
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-lg font-semibold ${
                following
                  ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                  : "bg-sky-600 hover:bg-sky-500 text-white"
              }`}
            >
              {following ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-3 text-gray-800 dark:text-gray-300">{user.bio}</p>
        )}

        {/* Stats */}
        <div className="mt-4 flex gap-6 text-sm">
          <span className="text-gray-800 dark:text-gray-200">
            <b>{user.followers}</b> Followers
          </span>
          <span className="text-gray-800 dark:text-gray-200">
            <b>{user.following}</b> Following
          </span>
        </div>
      </div>
    </div>
  );
}
