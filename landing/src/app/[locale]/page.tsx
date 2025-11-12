// app/[locale]/page.tsx
import SecurityHeader from "@/components/home/SecurityHeader";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import ServicesList from "@/components/home/ServicesList"; // Yangi komponentni import qilish
import NewsList from "@/components/home/NewsList";
import TestimonialsSection from "@/components/home/TestimonialsSection";


export default async function HomePage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params; 
  const dict = await getDictionary(locale);

  return (
    <div>
      <SecurityHeader dict={dict} locale={locale} />
      <div className="container mx-auto px-5 py-10">
        <h1 className="text-4xl font-bold mb-6">{dict.hero.about.title}</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 pr-0 xl-pr-5 mb-20">
          {dict.hero.about.content}
        </p>

        {/* ServicesList komponentini shu yerda ishlatamiz */}
        <NewsList locale={locale} dict={dict}/>
        <ServicesList locale={locale} dict={dict}/>
        <TestimonialsSection locale={locale} />
       
      </div>
    </div>
  );
}