"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AuthBackButton({ to = "/" }: { to?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(to)}
      className="fixed top-4 left-4 z-50 
        flex items-center justify-center 
        w-10 h-10 rounded-full 
        bg-white dark:bg-gray-800 
        shadow-md hover:shadow-lg 
        text-gray-700 dark:text-gray-200 
        hover:text-sky-600 dark:hover:text-sky-400 
        transition-transform transform hover:scale-110 
        cursor-pointer"
    >
      <ArrowLeft className="w-6 h-6" />
    </button>
  );
}
