// src/app/[locale]/services/page.tsx
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries"; // Lug'atni olish uchun
import { serviceService } from "@/app/api/services/route";
import ServiceClient from "@/components/services/ServiceClient";

export default async function ServicesPage(props: { params: { locale: Locale } }) {
  const { locale } = await props.params;

  const dict = await getDictionary(locale);
  const data = await serviceService.getAllServices(locale, 1, 6);

  return (
    <ServiceClient
      locale={locale}
      dict={dict}
      initialServices={data.results}
      initialNext={data.next}
      initialPrev={data.previous}
    />
  );
}
