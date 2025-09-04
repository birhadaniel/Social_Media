
"use client";

import Image from "next/image";
import { useState } from "react";

export type EditableUser = {
  id: number;
  username: string;
  bio?: string;
  avatar: string;
};

type Props = {
  initial: EditableUser;
  onSave: (u: EditableUser ) => void;
  onCancel?: () => void;
};

export default function EditProfileForm({ initial, onSave, onCancel }: Props) {
  const [username, setUsername] = useState(initial.username);
  const [bio, setBio] = useState(initial.bio ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async() => {
    setLoading(true);
    setError(null);
    try {
      await onSave({
        id: initial.id,
        username,
        bio,
        avatar: initial.avatar, 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex items-center gap-4">
        <Image
          src={initial.avatar}
          alt="Avatar"
          width={72}
          height={72}
          className="rounded-full"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">Profile photo (cannot be changed)</span>
        {/* <label className="px-3 py-2 rounded-lg  bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm  cursor-pointer">
          Change photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickAvatar}
          />
        </label> */}
      </div>
      <div className="grid gap-3">
        <label className="text-sm text-gray-600 dark:text-gray-400 ">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500 text-white font-semibold"
          disabled={loading}
        />
      </div>

      <div className="grid gap-3">
        <label className="text-sm text-gray-600 dark:text-gray-400">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500 resize-none text-white font-semibold"
          disabled={loading}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
