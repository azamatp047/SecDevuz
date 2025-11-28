import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { serviceService, ServiceItem } from "@/app/api/services/route";
import { notFound } from "next/navigation";
import AnimatedImage from "@/components/ui/AnimatedImage";
import ApplyServiceForm from "@/components/services/ApplyServiceForm";

interface ServiceDetailPageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.locale);

  let service: ServiceItem | null = null;
  try {
    service = await serviceService.getServiceById(
      parseInt(resolvedParams.id),
      resolvedParams.locale
    );
  } catch (error) {
    console.error(`Xizmat (ID: ${resolvedParams.id}) yuklashda xatolik:`, error);
    notFound();
  }

  if (!service) notFound();

  const title = service.title ?? "";
  const description = service.description ?? "";
  const categoryName = service.category.name ?? "";

  return (
    <div className="container mx-auto px-5 pt-25 flex flex-col md:flex-row gap-10 relative"> {/* relative qo'shildi */}
      <div className="w-full md:w-2/3 md:mt-[-15px]">
        
        <h1 className="text-xl md:text-2xl xl:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          {title}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          {dict.services.category}: <span className="font-semibold">{categoryName}</span>
        </p>

        {service.image && (
          <div className="relative w-full h-40 md:h-100 xl:h-140 mb-8 rounded-lg overflow-hidden shadow-md">
            <AnimatedImage
              src={service.image}
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

      {/* Xizmatni sotib olish formasi */}
      {/* ApplyServiceForm ni fixed qilish uchun o'zgartirishlar */}
      <div className="w-full md:w-1/3 md:sticky md:top-24 h-fit"> {/* sticky va top-24 qo'shildi */}
        <ApplyServiceForm serviceId={service.id} dict={dict} locale={resolvedParams.locale} />
      </div>
    </div>
  );
}