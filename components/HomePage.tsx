"use client";
import Image from "next/image";
import Link from "next/link";
import Button from "./ui/Button";
        
export default function HomePage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6 overflow-hidden">
      <div className="flex flex-col items-center text-center max-w-2xl w-full gap-6 md:gap-10 transition-colors duration-300">
        <div className="w-full flex justify-center relative z-10 animate-fadeIn">
          <div className="relative aspect-square w-64 sm:w-72 md:w-80">
            <Image
              src="/images/Home.jpg"
              alt="LinkUp illustration"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 80vw, 400px"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 px-4 animate-fadeIn animation-delay-200">
          <h1 className="text-[clamp(1.5rem,5vw,3rem)] font-extrabold text-gray-900 dark:text-white">
            LinkUp!
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Connect, share, and build your digital story — one post at a time.
          </p>
        </div>

        <div className="flex flex-col items-center w-full gap-6 animate-fadeIn animation-delay-400">
          <Button
            href="/auth/register"
            className="w-full max-w-sm px-8 py-3 text-lg shadow-md hover:shadow-lg transition dark:bg-sky-600 dark:hover:bg-sky-500"
          >
            Get Started
          </Button>

          <p className="text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-sky-500 font-semibold hover:underline cursor-pointer focus:outline-none"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
