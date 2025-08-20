"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthBackButton from "@/components/auth/AuthBackButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Login success.", { email, password });
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-b from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AuthBackButton to="/" />

      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Hey, Welcome Back!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Please login to your account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-5 h-5" />}
            error={errors.email}
          />

          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-5 h-5" />}
            error={errors.password}
          />

          <Link
            href="/auth/resetPassword"
            className="text-sm font-medium text-sky-500 hover:underline text-right"
          >
            Forgot Password?
          </Link>

          <Button
            type="submit"
            className="w-full py-3 text-lg rounded-lg shadow-md hover:shadow-lg dark:bg-sky-600 dark:hover:bg-sky-500 cursor-pointer"
          >
            Login
          </Button>
        </form>

        <p className="text-gray-500 dark:text-gray-400 text-center">
          Don’t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-sky-500 font-semibold hover:underline cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
