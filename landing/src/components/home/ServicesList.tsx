import { Locale } from "@/lib/i18n/config";
import { serviceService, ServiceItem } from "@/app/api/services/route";
import Link from "next/link";
import AnimatedImage from "../ui/AnimatedImage";
import { ArrowRight } from "lucide-react";

interface ServicesListProps {
  locale: Locale;
  dict: any;
}

export default async function ServicesList({ locale, dict }: ServicesListProps) {
  let services: ServiceItem[] = [];
  let errorFetchingServices: string | null = null;

  try {
    const servicesResponse = await serviceService.getLimitedServices(locale);
    if (servicesResponse && Array.isArray(servicesResponse.results)) {
      services = servicesResponse.results;
    } else {
      console.error("API dan kutilmagan javob formati:", servicesResponse);
      errorFetchingServices = "Xizmatlarni yuklashda kutilmagan xatolik yuz berdi.";
    }
  } catch (error: any) {
    console.error("Xizmatlarni yuklashda xatolik:", error);
    if (error.response && error.response.status === 404) {
      errorFetchingServices = "Xizmatlar topilmadi. Iltimos, URL manzilini tekshiring.";
    } else {
      errorFetchingServices = error.message || "Xizmatlarni yuklashda xatolik yuz berdi.";
    }
  }

  return (
    <div className="my-10">
      <h2 className="text-3xl font-bold my-5">{dict.services.our_services}</h2>
      <h1 className="text-3xl font-black mb-1">{dict.services.desc_home_1}</h1>
      <p className="text-sm mb-6">
        {dict.services.desc_home_2}
      </p>

      {errorFetchingServices ? (
        <p className="text-red-500 dark:text-red-400 text-lg">
          {errorFetchingServices} {dict.services.error_fetching}
        </p>
      ) : services.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const serviceTitle = service.title ?? "";
              const categoryName = service.category.name ?? "";

              return (
                <Link href={`/${locale}/services/${service.id}`} key={service.id}>
                  <div className="group rounded-lg hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
                    {service.image ? (
                      <AnimatedImage
                        src={service.image}
                        alt={serviceTitle}
                        className="rounded-t-lg! w-full object-cover"
                        height="h-53!"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-blue-900 text-gray-500 dark:text-gray-400 rounded-t-lg">
                        {dict.services.no_picture}
                      </div>
                    )}

                    <div className="py-6 pl-2 flex-grow flex flex-col justify-between bg-white dark:bg-gray-800 rounded-b-lg">
                      <h3 className="text-xl line-clamp-2 font-semibold mb-2 text-gray-900 dark:text-white group-hover:underline">
                        {serviceTitle}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {dict.services.category}: {categoryName}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* === Tugma shu yerda === */}
          <div className="flex justify-center mt-10">
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {dict.services.see_all_services}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          {dict.services.no_services}
        </p>
      )}
    </div>
  );
}
