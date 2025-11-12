"use client";

import { useState, useMemo } from "react";
import AnimatedImage from "@/components/ui/AnimatedImage";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewsClient({
  locale,
  dict,
  data,
}: {
  locale: Locale;
  dict: any;
  data: any[];
}) {
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    return data.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, data]);

  return (
    <div className="container mx-auto px-5 pt-23 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl xl:text-3xl font-bold">
          {dict.news?.title}
        </h1>
        <input
          type="text"
          placeholder={dict.news?.search_placeholder || "Yangilik qidirish..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-auto xl:w-[400px] px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-950 dark:text-white transition-all duration-200"
        />
      </div>

      {filteredData.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {dict.news?.no_news || "Yangilik topilmadi."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((post) => (
            <Link
              href={`/${locale}/news/${post.id}`}
              key={post.id}
              className="group"
            >
              <Card className="h-full flex flex-col overflow-hidden pt-0! pb-0 gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                {post.image ? (
                  <AnimatedImage
                    src={post.image}
                    alt={post.title}
                    className="w-full object-cover"
                    height="h-[200px]"
                  />
                ) : (
                  <div className="w-full h-[200px] flex items-center justify-center bg-gray-200 dark:bg-blue-900 text-gray-500 dark:text-gray-400">
                    {dict.common?.no_image || "Rasm yo‘q"}
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:underline transition-all duration-200">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  {post.category && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {post.category.name}
                    </p>
                  )}
                  {post.created_at && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(post.created_at).toISOString().split("T")[0]}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
