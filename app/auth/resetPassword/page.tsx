"use client";

import { useState } from "react";
import { useAuth } from '@/hooks/useAuth';
import { Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import BackButton from "@/components/ui/BackButton";


export default function ForgotPasswordPage() {
  const { handleResetPassword, loading, error } = useAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleResetPassword({ email });
  
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-b from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <BackButton to="/auth/login" />

      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reset Your Password
        </h1>
        {error && <p className={`mb-4 ${error.includes('link sent') ? 'text-green-500' : 'text-red-500'}`}>{error}</p>}
        <p className="text-gray-600 dark:text-gray-400">
          Enter your email to receive reset instructions
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-5 h-5" />}
          />

          <Button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 text-lg rounded-lg shadow-md hover:shadow-lg dark:bg-sky-600 dark:hover:bg-sky-500 cursor-pointer"
          >
            {loading ? 'Sending...' :'Send Reset Link'}
          </Button>
        </form>
      </div>
    </main>
  );
}
