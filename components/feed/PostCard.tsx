"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export interface PostCardProps {
  id: string;
  name: string;
  username: string;
  time: string;
  content: string;
  image?: string; 
  likes: number;
  comments: number;
  shares: number;
}

export default function PostCard(props: PostCardProps) {
  const { id, name, username, time, content, image, likes, comments, shares } =
    props;

  const router = useRouter();

  // Local UI state 
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [shareCount, setShareCount] = useState(shares);

  const avatarFallback = useMemo(
    () => username?.slice(0, 1)?.toUpperCase() || "U",
    [username]
  );

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/post/${id}`
      : `/post/${id}`;

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? Math.max(0, c - 1) : c + 1));
  };

  const goToComments = () => {
    router.push(`/post/${id}`);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${name} on SocialApp`,
          text: content,
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard 📋");
      } else {
        prompt("Copy this link:", shareUrl);
      }
      setShareCount((c) => c + 1);
    } catch {
      console.error("Share failed");
    }
  };

  return (
    <article className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        {/* Avatar */}
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
          {/* If you later have user.avatarUrl, replace this block with <Image ... src={user.avatarUrl} /> */}
          <span className="font-semibold">{avatarFallback}</span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-gray-900 dark:text-white">
              {name}
            </p>
            <span className="text-gray-400">·</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              @{username}
            </p>
            <span className="text-gray-400">·</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">{time}</p>
          </div>
        </div>

        <button
          className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="More actions"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3 whitespace-pre-wrap text-gray-900 dark:text-gray-100">
        {content}
      </div>

      {/* Media*/}
      {image && (
        <div className="px-4 pb-3">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <Image
              src={image}
              alt="Post media"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
              priority={false}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 px-4 py-3 text-sm">
        <button
          onClick={toggleLike}
          className="group inline-flex items-center gap-2 text-gray-600 hover:text-red-500 dark:text-gray-300"
          aria-pressed={liked}
          aria-label="Like"
        >
          <Heart
            className={`h-5 w-5 transition ${
              liked ? "fill-red-500 text-red-500" : "group-hover:scale-110"
            }`}
          />
          <span className="tabular-nums">{likeCount}</span>
        </button>

        <button
          onClick={goToComments}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 dark:text-gray-300"
          aria-label="Comments"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="tabular-nums">{comments}</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300"
          aria-label="Share"
        >
          <Share2 className="h-5 w-5" />
          <span className="tabular-nums">{shareCount}</span>
        </button>
      </div>
    </article>
  );
}
