"use client";

import Sidebar from "@/components/ui/Sidebar";
import BottomNav from "@/components/ui/BottomNav";
import EditProfileForm, {
  EditableUser,
} from "@/components/profile/EditProfileForm";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/UserStore";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { updateUser } from "@/lib/api";
import { useEffect } from "react";

export default function EditProfilePage() {
  const router = useRouter();
  const { userId, loading: authLoading } = useAuth();
  const { setUser, updateUser: updateStoreUser } = useUserStore();

  const isUserIdReady = typeof userId === 'number';
  const { user, error: userError } = useUser(isUserIdReady ? userId : 0);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  const current: EditableUser = user
    ? {
        id: user.id, // id is number, matching EditableUser
        username: user.username,
        bio: user.bio ?? '',
        avatar: user.avatar ?? '/images/default-avatar.png'
      }
    : {
        id: 0, // Temporary ID until user is loaded
        username: 'loading',
        bio: '',
        avatar: '/images/default-avatar.png',
      };

  const handleSave = async (updated: EditableUser) => {
    if (typeof userId !== 'number') {
      console.error('No valid user ID available');
      return;
    }
    try {
      await updateUser(userId, {
        username: updated.username,
        bio: updated.bio,
      });
      updateStoreUser(updated.id.toString(), {
        id: updated.id,
        username: updated.username,
        bio: updated.bio,
        avatar: updated.avatar,
      });
      router.push(`/profile/${updated.id}`);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (authLoading || !isUserIdReady) {
    return <p>Loading...</p>;
  }

  if (userError) return <p className="text-red-500">{userError}</p>;
  if (!userId) return <p className="text-red-500">Please log in to edit your profile</p>;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="sm:ml-60 flex justify-center">
        <div className="w-full max-w-2xl px-2 pt-6 pb-20">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Edit Profile
          </h1>
          <EditProfileForm
            initial={current}
            onSave={handleSave}
            onCancel={() => router.back()}
          />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}