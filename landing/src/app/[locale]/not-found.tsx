// app/[locale]/not-found.tsx
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import Image from "next/image";
import { Locale } from "@/lib/i18n/config";
import { headers } from "next/headers";

// Helper function: URL dan locale ni ajratib olish
function extractLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean);
  const possibleLocale = segments[0] as Locale;
  
  // Agar birinchi segment locale bo'lsa, qaytaramiz
  const validLocales: Locale[] = ["uz", "ru", "en"];
  return validLocales.includes(possibleLocale) ? possibleLocale : "en";
}

export default async function NotFoundPage() {
  // Server-side: headers orqali pathname ni olish
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("referer") || "/en";
  
  const locale = extractLocaleFromPath(pathname);

  let dict;
  try {
    dict = await getDictionary(locale);
  } catch (error) {
    // Agar dictionary yuklanmasa, default ingliz tilidan foydalanamiz
    dict = await getDictionary("en");
  }

  const t = dict.notFound || {
    title: "Page Not Found",
    desc: "The page you are looking for does not exist.",
    back: "Go Home",
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0f172a] text-gray-800 dark:text-gray-100 px-4">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md">
        <Image
          src="/notFound.png"
          alt="Not Found"
          width={250}
          height={250}
          className="opacity-90 dark:opacity-80"
          priority
        />
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-gray-600 dark:text-gray-300">{t.desc}</p>
        <Link
          href={`/${locale}`}
          className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {t.back}
        </Link>
      </div>
    </main>
  );
}