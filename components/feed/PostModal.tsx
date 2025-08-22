"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, Video, X } from "lucide-react";
import { useUser } from "@/hooks/useUser"; 

interface PostModalProps {
  onClose: () => void;
  onPost: (newPost: { content: string; media?: string }) => void;
}

export default function PostModal({ onClose, onPost }: PostModalProps) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 👇 get current user (dynamic instead of hardcoded)
  const user = useUser();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    let mediaUrl: string | undefined;
    if (media) {
      const formData = new FormData();
      formData.append("file", media);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        mediaUrl = data.url;
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    onPost({ content, media: mediaUrl });
    setContent("");
    setMedia(null);
    setPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-4">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4 sticky top-0 bg-white/90 dark:bg-gray-900/90 z-10">
          <Image
            src={user.avatar}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-xs text-gray-500">Public</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What's on your mind, ${user.name}?`} // 👈 even the placeholder is personalized
          className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg mb-3 bg-transparent focus:outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          rows={3}
        />

        {/* Preview */}
        {preview && (
          <div className="mb-3">
            {media?.type.startsWith("video/") ? (
              <video src={preview} controls className="w-full rounded-lg" />
            ) : (
              <Image
                src={preview}
                alt="Preview"
                width={500}
                height={500}
                unoptimized
                className="w-full rounded-lg object-cover"
              />
            )}
          </div>
        )}

        {/* Add media */}
        <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 mb-4 bg-transparent">
          <p className="text-sm text-gray-500">Add to your post</p>
          <div className="flex space-x-4">
            <label className="cursor-pointer text-sky-600 hover:text-sky-800">
              <ImageIcon className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <label className="cursor-pointer text-sky-600 hover:text-sky-800">
              <Video className="w-5 h-5" />
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg cursor-pointer"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
