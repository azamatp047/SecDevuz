"use client";

import { useState, useMemo } from "react";
import AnimatedImage from "@/components/ui/AnimatedImage";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { ProductItem } from "@/app/api/products/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductClientProps {
  locale: Locale;
  dict: any;
  products: ProductItem[];
}

export default function ProductClient({
  locale,
  dict,
  products,
}: ProductClientProps) {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    return products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

  return (
    <div className="container mx-auto px-5 pt-23 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl xl:text-3xl font-bold">
          {dict.products?.title}
        </h1>
        <input
          type="text"
          placeholder={dict.products?.search_placeholder || "Mahsulot qidirish..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-auto xl:w-[400px] px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-950 dark:text-white transition-all duration-200"
        />
      </div>
      <p className="mb-5 mt-3 text-sm">{dict.products.desc}</p>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {dict.products?.no_products}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link
              href={`/${locale}/products/${product.id}`}
              key={product.id}
              className="group"
            >
              <Card className="h-full flex flex-col overflow-hidden pt-0! pb-6 gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                {product.image ? (
                  <AnimatedImage
                    src={product.image}
                    alt={product.title}
                    className="w-full object-cover"
                    height="h-[200px]"
                  />
                ) : (
                  <div className="w-full h-[200px] flex items-center justify-center bg-gray-200 dark:bg-blue-900 text-gray-500 dark:text-gray-400">
                    {dict.common?.no_image || "Rasm yo'q"}
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:underline transition-all duration-200">
                    {product.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  {product.category && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.category.name}
                    </p>
                  )}
                  <p className="text-lg font-bold text-primary mt-2">
                    {product.price} {dict.products?.currency || "so'm"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}