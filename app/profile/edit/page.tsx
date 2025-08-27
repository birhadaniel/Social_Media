"use client";

import Sidebar from "@/components/ui/Sidebar";
import BottomNav from "@/components/ui/BottomNav";
import EditProfileForm, {
  EditableUser,
} from "@/components/profile/EditProfileForm";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/UserStore"; 

export default function EditProfilePage() {
  const router = useRouter();
  const { users, updateUser } = useUserStore(); 
  const current = users["123"]; // assuming "123" is the logged-in user

  const handleSave = (updated: EditableUser & { avatarFile?: File | null }) => {
    updateUser(updated.id, {
      name: updated.name,
      username: updated.username,
      bio: updated.bio,
      avatar: updated.avatar,
    });

    router.push(`/profile/${updated.id}`); 
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="sm:ml-60 flex justify-center">
        <div className="w-full max-w-2xl px-2 pt-6 pb-20">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Edit Profile
          </h1>
          <EditProfileForm
            initial={current} // use store value,not MOCK
            onSave={handleSave}
            onCancel={() => router.back()}
          />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
