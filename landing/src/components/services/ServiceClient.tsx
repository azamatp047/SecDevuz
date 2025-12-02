"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import AnimatedImage from "@/components/ui/AnimatedImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceItem } from "@/app/api/services/route";
import api from "@/lib/api";

interface Props {
  locale: string;
  dict: any;
  initialServices: ServiceItem[];
  initialNext: string | null;
  initialPrev: string | null;
}

export default function ServiceClient({
  locale,
  dict,
  initialServices,
  initialNext,
  initialPrev,
}: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [services, setServices] = useState(initialServices);
  const [nextUrl, setNextUrl] = useState(initialNext);
  const [prevUrl, setPrevUrl] = useState(initialPrev);

  // Load services on page change
  useEffect(() => {
    async function loadPage() {
      if (page === 1) return; // 1-sahifa serverdan kelgan

      const res = await api.get(
        `/${locale !== "uz" ? locale : ""}/v1/services/?limit=6&offset=${(page - 1) * 6}`
      );

      setServices(res.data.results);
      setNextUrl(res.data.next);
      setPrevUrl(res.data.previous);
    }
    loadPage();
  }, [page, locale]);

  // Search filtering
  const filtered = useMemo(() => {
    if (!query.trim()) return services;
    return services.filter((s) =>
      s.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, services]);

  return (
    <div className="container mx-auto px-5 pt-23 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl xl:text-3xl font-bold">{dict.services?.title}</h1>

        <input
          type="text"
          placeholder={dict.services?.search_placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-auto xl:w-[400px] px-5 py-3 border border-gray-300 rounded-xl"
        />
      </div>

      <p className="mb-5 mt-3 text-sm">{dict.services.desc}</p>

      {/* No results */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">{dict.services?.no_news}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((service) => (
            <Link
              href={`/${locale}/services/${service.id}`}
              key={service.id}
              className="group"
            >
              <Card className="h-full flex flex-col overflow-hidden pt-0 pb-6 gap-2 shadow-md hover:shadow-lg transition-all">
                {service.image ? (
                  <AnimatedImage
                    src={service.image}
                    alt={service.title}
                    className="w-full object-cover"
                    height="h-[200px]"
                  />
                ) : (
                  <div className="w-full h-[200px] flex items-center justify-center bg-gray-200 text-gray-500">
                    {dict.common?.no_image}
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-xl font-semibold line-clamp-2 group-hover:underline">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="mt-auto">
                  {service.category && (
                    <p className="text-sm text-gray-600">{service.category.name}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(service.created_at).toISOString().split("T")[0]}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {nextUrl || prevUrl ? (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!prevUrl}
            className={`px-4 py-2 rounded-lg border ${
              prevUrl ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"
            }`}
          >
            {dict.services?.prev || "Oldingi"}
          </button>

          <span className="font-semibold">{page}</span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!nextUrl}
            className={`px-4 py-2 rounded-lg border ${
              nextUrl ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"
            }`}
          >
            {dict.services?.next || "Keyingi"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
