import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { productService } from "@/app/api/products/route";
import ProductClient from "@/components/products/ProductClient";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>; // <-- Promise qilib oling
}) {
  const { locale } = await params; // <-- await qilish
  const dict = await getDictionary(locale);
  const data = await productService.getAllProducts(locale, 1, 6);

  return (
    <ProductClient
      locale={locale}
      dict={dict}
      initialProducts={data.results}
      initialNext={data.next}
      initialPrev={data.previous}
    />
  );
}
