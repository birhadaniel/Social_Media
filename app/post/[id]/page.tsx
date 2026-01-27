"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import BackButton from "@/components/ui/BackButton";

interface Comment {
  id: string;
  user: string;
  text: string;
  time: string;
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [comments, setComments] = useState<Comment[]>([
    { id: "1", user: "alice", text: "This is awesome! ", time: "2m" },
    { id: "2", user: "bob", text: "Love this idea ", time: "5m" },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const fakeComment: Comment = {
      id: Date.now().toString(),
      user: "me",
      text: newComment,
      time: "just now",
    };
    setComments([fakeComment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 relative">
      
      <BackButton to="/feed" />

      <div className="border-b border-gray-200 dark:border-gray-800 p-4 md:p-5 text-center">
        <span className="text-sm text-gray-500">Post #{id}</span>
      </div>

      {/* Post content  AFTER B-E*/}
      {/* Commentlist */}
      <div className="flex-1 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">
            No comments yet. Be the first!
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {comments.map((c) => (
              <li key={c.id} className="p-4 flex gap-3">
                {/* Avatar */}
                <div className="relative h-10 w-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <span className="font-semibold">
                    {c.user[0].toUpperCase()}
                  </span>
                </div>

                {/*content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      @{c.user}
                    </span>
                    <span className="text-xs text-gray-500">{c.time}</span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {c.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* input*/}
      <div className="border-t border-gray-200 dark:border-gray-800 p-3 flex items-center gap-2 sticky bottom-0 bg-white dark:bg-gray-900">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 
                     text-sm text-gray-900 dark:text-white 
                     focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className="px-4 py-2 rounded-full bg-sky-600 text-white text-sm font-medium 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post
        </button>
      </div>
    </div>
  );
}
