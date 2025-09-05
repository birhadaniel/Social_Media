"use client";

import { useState } from 'react'; 
import { UserPlus, MessageCircle, Check, Settings, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
  user: {
    id: number;
    username: string;
    bio: string;
    profilePicture: string;
    followersCount: number;
    followingCount: number;
    postsCount: number;
  };
  isFollowing: boolean;
  hasConversation: boolean;
  currentUserId: number | null;
}

export default function ProfileHeader({ user, isFollowing, hasConversation, currentUserId }: ProfileHeaderProps) {
  const [followingState, setFollowingState] = useState(isFollowing);
  const [conversationState, setConversationState] = useState(hasConversation);
  const router = useRouter();

  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFollowingState(true);
        console.log('Followed successfully');
      } else {
        console.error('Failed to follow:', response.status);
      }
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}/follow`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFollowingState(false);
        console.log('Unfollowed successfully');
      } else {
        console.error('Failed to unfollow:', response.status);
      }
    } catch (error) {
      console.error('Unfollow error:', error);
    }
  };
  
  const handleMessage = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: user.id,
          content: "Hello, I would like to start a conversation.",
        }),
      });

      if (response.ok) {
        setConversationState(true);
        router.push(`/messages/${user.id}`);
      } else {
        console.error('Failed to start conversation:', response.status);
      }
    } catch (error) {
      console.error('Start conversation error:', error);
    }
  };

  const isOwnProfile = currentUserId === user.id;

  return (
    <div className="flex flex-col items-center text-center p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="w-24 h-24 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-4xl">
        {user.profilePicture ? (
          <img 
            src={user.profilePicture} 
            alt={user.username} 
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          user.username?.[0]?.toUpperCase() || 'U'
        )}
      </div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {user.username}
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-sm">
        {user.bio}
      </p>

      {/* Stats Section */}
      <div className="mt-4 flex space-x-6 text-center">
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100">{user.postsCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100">{user.followersCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100">{user.followingCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Following</p>
        </div>
      </div>
      
      {/* Buttons Section */}
      <div className="mt-4 flex space-x-2">
        {isOwnProfile ? (
          <>
            <button
              onClick={() => router.push('/settings/profile')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </>
        ) : (
          <>
            {followingState ? (
              <button
                onClick={handleUnfollow}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <Check className="w-4 h-4" />
                <span>Following</span>
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-full text-sm font-medium hover:bg-sky-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Follow</span>
              </button>
            )}
            {conversationState ? (
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-medium dark:bg-gray-700 dark:text-gray-200"
                disabled
              >
                <MessageCircle className="w-4 h-4" />
                <span>Has Conversation</span>
              </button>
            ) : (
              <button
                onClick={handleMessage}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </button>
            )}

          </>
        )}
      </div>
    </div>
  );
}