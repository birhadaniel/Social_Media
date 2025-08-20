"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  type,
  placeholder,
  value,
  onChange,
  icon,
  error,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full">
      <div
        className={`flex items-center border rounded-lg px-2 sm:px-3 py-2 bg-white dark:bg-gray-900 
          ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"} 
          focus-within:ring-2 focus-within:ring-sky-500`}
      >
        {icon && (
          <span className="text-gray-400 mr-1 sm:mr-2 flex-shrink-0">
            {icon}
          </span>
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 min-w-0 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm sm:text-base"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="ml-1 sm:ml-2 text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 cursor-pointer flex-shrink-0"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
