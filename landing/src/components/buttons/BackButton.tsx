"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <p
      onClick={() => router.back()}
      className="inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 transition-colors duration-200 cursor-pointer"
    >
      &larr; 
    </p>
  );
}
