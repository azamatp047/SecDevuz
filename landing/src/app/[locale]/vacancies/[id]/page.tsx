import { vacancyService } from "@/app/api/vacancies/route";
import { getDictionary } from "@/lib/i18n/dictionaries";
import ApplyForm from "@/components/vacancy/ApplyForm";
import { Locale } from "@/lib/i18n/config";

export default async function VacancyDetailPage(props: {
  params: Promise<{ locale: Locale, id: string }>;
}) 
{
  const { locale, id } = await props.params;
  const dict = await getDictionary(locale);
  const vacancy = await vacancyService.getVacancyById(Number(id), locale);

  return (
    <section className="container mx-auto px-5 mt-16 h-full py-10 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-3xl font-semibold mb-4">{vacancy.title}</h1>
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: vacancy.description }}
        />
        <p className="text-sm mt-5 text-muted-foreground">
          {dict.vacancies.deadline}: {new Date(vacancy.deadline).toLocaleDateString()}
        </p>
      </div>

      <div>
        <ApplyForm vacancyId={vacancy.id} dict={dict} locale={locale}  />
      </div>
    </section>
  );
}
