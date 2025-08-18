import Link from "next/link";
import { PropsWithChildren } from "react";

interface ButtonProps extends PropsWithChildren {
  href?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export default function Button({
  href,
  children,
  className,
  type = "button",
  onClick,
}: ButtonProps) {
  // Base styles
  const baseStyles =
    "relative bg-sky-700 text-white py-3 px-6 rounded-lg text-lg w-full text-center hover:bg-sky-600 transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50";

  // If href is provided, render a Link component
  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${className || ""}`}>
        {children}
      </Link>
    );
  }

  // If no href, render a standard button
  return (
    <button
      type={type}
      className={`${baseStyles} ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
