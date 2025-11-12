"use client";

import { useState, useMemo } from "react";
import AnimatedImage from "@/components/ui/AnimatedImage"; // AnimatedImage komponentini import qilish
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { ServiceItem } from "@/app/api/services/route"; // ServiceItem interfeysini import qilish
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // shadcn Card komponentlari

interface ServiceClientProps {
  locale: Locale;
  dict: any; // Lug'at obyekti
  services: ServiceItem[]; // Xizmatlar ro'yxati
}

export default function ServiceClient({
  locale,
  dict,
  services,
}: ServiceClientProps) {
  const [query, setQuery] = useState("");

  const filteredServices = useMemo(() => {
    if (!query.trim()) return services;
    return services.filter((service) =>
      service.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, services]);

  return (
    <div className="container mx-auto px-5 pt-23 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl xl:text-3xl font-bold">
          {dict.services?.title}
        </h1>{" "}
        {/* Lug'atdan sarlavha */}
        <input
          type="text"
          placeholder={dict.services?.search_placeholder || "Xizmat qidirish..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-auto xl:w-[400px] px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-950 dark:text-white transition-all duration-200"
        />
      </div>
      <p className="mb-5 mt-3 text-sm">{dict.services.desc}</p>

      {filteredServices.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {dict.services?.no_news}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <Link
              href={`/${locale}/services/${service.id}`}
              key={service.id}
              className="group"
            >
              <Card className="h-full flex flex-col overflow-hidden pt-0! pb-6 gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                {service.image ? (
                  <AnimatedImage
                    src={service.image}
                    alt={service.title}
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
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  {service.category && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {service.category.name}
                    </p>
                  )}
                  {service.created_at && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(service.created_at).toISOString().split("T")[0]}
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