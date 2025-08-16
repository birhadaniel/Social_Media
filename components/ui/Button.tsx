import Link from "next/link";

interface ButtonProps {
  href: string;
  label: string;
  className?: string;
}

export default function Button({ href, label, className }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`relative bg-sky-700 text-white py-3 px-8 rounded-full text-lg w-full max-w-sm mx-auto text-center hover:bg-sky-600 transition ${
        className || ""
      }`}
    >
      {label}
    </Link>
  );
}
