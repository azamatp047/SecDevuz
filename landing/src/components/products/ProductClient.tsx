"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import AnimatedImage from "@/components/ui/AnimatedImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductItem, productService } from "@/app/api/products/route";

interface Props {
  locale: string;
  dict: any;
  initialProducts: ProductItem[];
  initialNext: string | null;
  initialPrev: string | null;
}

export default function ProductClient({
  locale,
  dict,
  initialProducts,
  initialNext,
  initialPrev,
}: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState(initialProducts);
  const [nextUrl, setNextUrl] = useState(initialNext);
  const [prevUrl, setPrevUrl] = useState(initialPrev);

  useEffect(() => {
    async function loadPage() {
      if (page === 1) return;

      const data = await productService.getAllProducts(locale, page, 6);
      setProducts(data.results);
      setNextUrl(data.next);
      setPrevUrl(data.previous);
    }
    loadPage();
  }, [page, locale]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    return products.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

  return (
    <div className="container mx-auto px-5 pt-23 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl xl:text-3xl font-bold">{dict.products?.title}</h1>
        <input
          type="text"
          placeholder={dict.products?.search_placeholder || "Mahsulot qidirish..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-auto xl:w-[400px] px-5 py-3 border border-gray-300 rounded-xl"
        />
      </div>

      <p className="mb-5 mt-3 text-sm">{dict.products.desc}</p>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">{dict.products?.no_products}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link href={`/${locale}/products/${product.id}`} key={product.id} className="group">
              <Card className="h-full flex flex-col overflow-hidden pt-0 pb-6 gap-2 shadow-md hover:shadow-lg transition-all">
                {product.image ? (
                  <AnimatedImage
                    src={product.image}
                    alt={product.title}
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
                    {product.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-auto">
                  {product.category && (
                    <p className="text-sm text-gray-600">{product.category.name}</p>
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

      {nextUrl || prevUrl ? (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!prevUrl}
            className={`px-4 py-2 rounded-lg border ${prevUrl ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"}`}
          >
            {dict.services?.prev || "Oldingi"}
          </button>

          <span className="font-semibold">{page}</span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!nextUrl}
            className={`px-4 py-2 rounded-lg border ${nextUrl ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"}`}
          >
            {dict.services?.next || "Keyingi"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
