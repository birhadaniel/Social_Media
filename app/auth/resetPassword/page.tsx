"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import BackButton from "@/components/ui/BackButton";
import { useRouter } from "next/navigation";


export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
    } else {
      setError(null);
      console.log("Password reset requested for", email);
      alert("Reset link sent to your email"); // temporary feedback
      router.push("/auth/login"); 
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-b from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <BackButton to="/auth/login" />

      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reset Your Password
        </h1>
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
            error={error || undefined}
          />

          <Button
            type="submit"
            className="w-full py-3 text-lg rounded-lg shadow-md hover:shadow-lg dark:bg-sky-600 dark:hover:bg-sky-500 cursor-pointer"
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    </main>
  );
}
