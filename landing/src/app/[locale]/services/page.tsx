// src/app/[locale]/services/page.tsx
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries"; // Lug'atni olish uchun
import { serviceService } from "@/app/api/services/route";
import ServiceClient from "@/components/services/ServiceClient";

export default async function ServicesPage(props: {
  params: { locale: Locale };
}) {
  // Await props.params before destructuring
  const { locale } = await props.params; // <-- FIX IS HERE
  const dict = await getDictionary(locale); // Tilga mos lug'atni yuklab olamiz
  const data = await serviceService.getAllServices(locale); // Barcha xizmatlarni yuklab olamiz

  return <ServiceClient locale={locale} dict={dict} services={data.results} />;
}