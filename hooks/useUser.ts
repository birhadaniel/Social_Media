import { useState, useEffect } from 'react';
import { getUser, updateUser, followUser, unfollowUser, checkFollowStatus } from '@/lib/api';
import { User } from '@/lib/type';

export const useUser = (userId: number) => {
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await getUser(userId);
        setUser(userData);
        const followStatus = await checkFollowStatus(userId);
        setIsFollowing(followStatus.isFollowing);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleUpdate = async (data: { bio?: string; profilePicture?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await updateUser(userId, data);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    setLoading(true);
    setError(null);
    try {
      await followUser(userId);
      setIsFollowing(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to follow user');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setLoading(true);
    setError(null);
    try {
      await unfollowUser(userId);
      setIsFollowing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unfollow user');
    } finally {
      setLoading(false);
    }
  };

  return { user, isFollowing, loading, error, handleUpdate, handleFollow, handleUnfollow };
};