// app/not-found.tsx (root level - fallback)
import Link from "next/link";
import Image from "next/image";

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
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
            <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300">
              The page you are looking for does not exist.
            </p>
            <Link
              href="/uz"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Go Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}