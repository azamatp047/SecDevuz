import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import ProductClient from "@/components/products/ProductClient";
import { productService } from "@/app/api/products/route";

export default async function ProductsPage(props: {
  params: { locale: Locale };
}) {
  const { locale } = await props.params;
  const dict = await getDictionary(locale);
  const data = await productService.getAllProducts(locale);

  return <ProductClient locale={locale} dict={dict} products={data.results} />;
}