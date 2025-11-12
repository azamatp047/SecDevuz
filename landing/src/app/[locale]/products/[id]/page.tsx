import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { productService, ProductItem } from "@/app/api/products/route";
import { notFound } from "next/navigation";
import BackButton from "@/components/buttons/BackButton";
import AnimatedImage from "@/components/ui/AnimatedImage";
import BuyProductForm from "@/components/products/BuyProductForm";

interface ProductDetailPageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.locale);

  let product: ProductItem | null = null;
  try {
    product = await productService.getProductById(
      parseInt(resolvedParams.id),
      resolvedParams.locale
    );
  } catch (error) {
    console.error(`Mahsulot (ID: ${resolvedParams.id}) yuklashda xatolik:`, error);
    notFound();
  }

  if (!product) notFound();

  const title = product.title ?? "";
  const description = product.description ?? "";
  const categoryName = product.category.name ?? "";
  const price = product.price ?? "0";

  return (
    <div className="container mx-auto px-5 pt-25 flex flex-col md:flex-row gap-10 relative">
      <div className="w-full md:w-2/3 md:mt-[-15px]">
        <BackButton />
        <h1 className="text-xl md:text-2xl xl:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          {title}
        </h1>

        <div className="flex items-center gap-4 mb-4">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {dict.products.category}: <span className="font-semibold">{categoryName}</span>
          </p>
          <p className="text-2xl font-bold text-primary">
            {price} {dict.products?.currency || "so'm"}
          </p>
        </div>

        {product.image && (
          <div className="relative w-full h-40 md:h-100 xl:h-140 mb-8 rounded-lg overflow-hidden shadow-md">
            <AnimatedImage
              src={product.image}
              alt={String(title)}
              className="rounded-lg"
              height="h-full!"
            />
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>

      {/* Mahsulotni sotib olish formasi */}
      <div className="w-full md:w-1/3 md:sticky md:top-24 h-fit">
        <BuyProductForm 
          productId={product.id} 
          productTitle={product.title}
          productPrice={product.price}
          dict={dict} 
          locale={resolvedParams.locale} 
        />
      </div>
    </div>
  );
}