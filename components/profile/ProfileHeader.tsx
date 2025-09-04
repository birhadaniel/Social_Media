"use client";

import Image from "next/image";
import { User } from "@/lib/type";

type Props = {
  user: User;
};

export default function ProfileHeader({ user}: Props) {

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Cover */}
      <div className="h-28 bg-gradient-to-r from-sky-500 to-indigo-600" />

      <div className="px-4 pb-4 -mt-10">
        <div className="flex items-end gap-4">
          <Image
            src={user.avatar ?? "/images/default-avatar.png"} 
            alt={user.username}
            width={96}
            height={96}
            className="rounded-full border-4 border-white dark:border-gray-900 shadow-md"
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {user.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-3 text-gray-800 dark:text-gray-300">{user.bio}</p>
        )}

        {/* Stats */}
        <div className="mt-4 flex gap-6 text-sm">
          <span>{user.postsCount || 0} Posts</span>
          <span>{user.followersCount || 0} Followers</span>
          <span>{user.followingCount || 0} Following</span>
        </div>
      </div>
    </div>
  );
}
