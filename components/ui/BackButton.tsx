"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ to = "/" }: { to?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(to)}
      className="absolute top-3 left-4 p-2 sm:p-3 rounded-full 
                 bg-white dark:bg-gray-900 shadow-md 
                 hover:bg-gray-100 dark:hover:bg-gray-800 
                 transition cursor-pointer"
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
    </button>
  );
}
