"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/ui/Sidebar";
import BottomNav from "@/components/ui/BottomNav";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserPosts from "@/components/profile/UserPosts";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { userId: currentUserId, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasConversation, setHasConversation] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchUserData = async () => {
      if (authLoading) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        console.log('Fetching user data for ID:', resolvedParams.id);
        console.log('API URL:', `/api/users/${resolvedParams.id}`);
        console.log('Token (first 20 chars):', token.substring(0, 20) + '...');

        const response = await fetch(`/api/users/${resolvedParams.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('API Response status:', response.status);
        console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          console.log('API Response data:', data);

          if (data.success && data.data && data.data.user) {
            setUserData(data.data.user);
            setIsFollowing(data.data.isFollowing);
            setHasConversation(data.data.hasConversation);
            setPosts(data.data.posts);
          } else {
            setError(data.error || 'Failed to load user data');
          }
        } else {
          const errorText = await response.text();
          console.log('API Error response:', errorText);
          setError(`Failed to fetch user: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [resolvedParams.id, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {authLoading ? 'Loading authentication...' : 'Loading profile...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">The user profile could not be loaded.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="sm:ml-60 flex justify-center">
        <div className="w-full max-w-2xl px-4 pt-6 pb-20">
          <ProfileHeader
            user={userData}
            isFollowing={isFollowing}
            hasConversation={hasConversation}
            currentUserId={currentUserId as number | null}
          />
          <UserPosts posts={posts} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}