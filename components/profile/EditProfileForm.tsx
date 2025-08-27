"use client";

import Image from "next/image";
import { useState } from "react";

export type EditableUser = {
  id: string;
  username: string;
  name: string;
  bio?: string;
  avatar: string;
};

type Props = {
  initial: EditableUser;
  onSave: (u: EditableUser & { avatarFile?: File | null }) => void;
  onCancel?: () => void;
};

export default function EditProfileForm({ initial, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial.name);
  const [username, setUsername] = useState(initial.username);
  const [bio, setBio] = useState(initial.bio ?? "");
  const [avatarPreview, setAvatarPreview] = useState(initial.avatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const onPickAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const handleSave = () => {
    onSave({
      id: initial.id,
      name,
      username,
      bio,
      avatar: avatarPreview, // mocked
      avatarFile,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Image
          src={avatarPreview}
          alt="Avatar"
          width={72}
          height={72}
          className="rounded-full"
        />
        <label className="px-3 py-2 rounded-lg  bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm  cursor-pointer">
          Change photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickAvatar}
          />
        </label>
      </div>

      <div className="grid gap-3">
        <label className="text-sm text-gray-600 dark:text-gray-400">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500 text-white font-semibold"
        />
      </div>

      <div className="grid gap-3">
        <label className="text-sm text-gray-600 dark:text-gray-400 ">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500 text-white font-semibold"
        />
      </div>

      <div className="grid gap-3">
        <label className="text-sm text-gray-600 dark:text-gray-400">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500 resize-none text-white font-semibold"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold"
        >
          Save
        </button>
      </div>
    </div>
  );
}
