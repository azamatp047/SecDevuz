import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { productService }  from "@/app/api/products/route";
import ProductClient from "@/components/products/ProductClient";

export default async function ProductsPage(props: { params: { locale: Locale } }) {
  const { locale } = await props.params;

  const dict = await getDictionary(locale);
  const data = await productService.getAllProducts(locale, 1, 6); // page 1, limit 6

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
