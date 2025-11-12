// app/[locale]/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = (params?.locale as string) || "uz";

  useEffect(() => {
    // Log xatoni server/monitoring servicega yuborish mumkin
    console.error("Error:", error);
  }, [error]);

  const translations = {
    uz: {
      title: "Xatolik yuz berdi",
      desc: "Nimadir noto'g'ri ketdi. Iltimos, qaytadan urinib ko'ring.",
      retry: "Qayta urinish",
      home: "Bosh sahifa",
    },
    ru: {
      title: "Произошла ошибка",
      desc: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
      retry: "Попробовать снова",
      home: "Главная",
    },
    en: {
      title: "Something went wrong",
      desc: "An error occurred. Please try again.",
      retry: "Try again",
      home: "Home",
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0f172a] text-gray-800 dark:text-gray-100 px-4">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-gray-600 dark:text-gray-300">{t.desc}</p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {t.retry}
          </button>
          <Link
            href={`/${locale}`}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium py-2 px-5 rounded-xl transition-all duration-200"
          >
            {t.home}
          </Link>
        </div>
        {process.env.NODE_ENV === "development" && error.message && (
          <details className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left w-full">
            <summary className="cursor-pointer font-mono text-sm text-red-600 dark:text-red-400">
              Error Details (dev only)
            </summary>
            <pre className="mt-2 text-xs overflow-auto">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}