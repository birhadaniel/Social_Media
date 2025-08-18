import { ReactNode } from "react";

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main
      className="flex flex-col min-h-screen bg-gradient-to-b from-white via-blue-50 to-white 
    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6"
    >
      <div className="flex flex-col justify-center flex-1 max-w-md w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{subtitle}</p>
        {children}
      </div>
    </main>
  );
}
