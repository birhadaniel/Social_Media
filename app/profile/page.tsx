'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/ui/Sidebar";
import BottomNav from "@/components/ui/BottomNav";
import { User } from '@/lib/type';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

export default function CurrentUserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            router.push('/auth/login');
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        let data;
        try {
          data = await response.json();
          console.log('Profile response:', data);
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          throw new Error('Invalid response format from server');
        }
        
        if (data.success && data.data) {
          setUser(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) return <LoadingPage />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!user) return <div>No profile data</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="sm:ml-60 flex justify-center">
        <div className="w-full max-w-2xl px-2 pt-6 pb-20">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome, {user.username}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Email: {user.email}</p>
            {user.bio && <p className="text-gray-700 dark:text-gray-300 mt-2">{user.bio}</p>}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
