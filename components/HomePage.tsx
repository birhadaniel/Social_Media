"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "./ui/Button";

const easeOutCurve: [number, number, number, number] = [0, 0, 0.2, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.8, ease: easeOutCurve },
});

export default function HomePage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 px-6 overflow-hidden">
      <div className="flex flex-col items-center text-center max-w-2xl w-full gap-10 md:gap-14">
    
        <motion.div
          className="absolute top-20 left-10 w-12 h-12 bg-sky-400/20 rounded-full blur-2xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-16 h-16 bg-pink-400/20 rounded-full blur-2xl"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="w-full flex justify-center relative z-10"
          {...fadeUp(0)}
        >
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
            <Image
              src="/images/Home.jpg"
              alt="LinkUp illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Title + Subtitle */}
        <motion.div className="flex flex-col gap-4 px-4" {...fadeUp(0.3)}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            LinkUp!
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Connect, share, and build your digital story — one post at a time.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col items-center w-full gap-6"
          {...fadeUp(0.6)}
        >
          <Button
            href="/auth/register"
            label="Get Started"
            className="w-full max-w-sm px-8 py-3 text-lg shadow-md hover:shadow-lg transition"
          />
          <p className="text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-sky-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
