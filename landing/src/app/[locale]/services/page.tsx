// src/app/[locale]/services/page.tsx
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { serviceService } from "@/app/api/services/route";
import ServiceClient from "@/components/services/ServiceClient";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>; // ⚡ Promise tipiga o‘zgartirdik
}) {
  const { locale } = await params; // ⚡ await qilinadi

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
