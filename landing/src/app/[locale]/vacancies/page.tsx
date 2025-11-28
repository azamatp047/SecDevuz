import { getDictionary } from "@/lib/i18n/dictionaries";
import { vacancyService } from "@/app/api/vacancies/route";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Locale } from "@/lib/i18n/config";

export default async function VacanciesPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  const dict = await getDictionary(locale);
  const data = await vacancyService.getAllVacancies(locale);

  return (
    <section className="container mx-auto px-5 py-10 mt-15 min-h-screen">
      <h1 className="text-3xl font-semibold mb-2">{dict.vacancies.title}</h1>
      <p className="text-sm mb-6">{dict.vacancies.desc}</p>

      <div className="grid gap-6 md:grid-cols-4 xl:grid-cols-3">
        {data.results.map((item) => (
          <div
            key={item.id}
            className="border border-amber-200! line-clamp-2 dark:border-neutral-700 rounded-xl p-5 hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-medium mb-2">{item.title}</h2>
              <p className="text-xs text-muted-foreground">
                {dict.vacancies.deadline}: {new Date(item.deadline).toLocaleDateString()}
              </p>
            </div>

            <Link
              href={`/${locale}/vacancies/${item.id}`}
              className="mt-4"
            >
              <Button className="w-full">
                {dict.vacancies.apply_btn }
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
