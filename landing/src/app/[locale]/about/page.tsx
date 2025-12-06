import CertificatesSection from "@/components/about/CertificatesSection";
import TeamSection from "@/components/about/TeamSection";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="container mx-auto px-4 pt-[66px]">
      {/* H1 */}
      <h1 className="text-4xl font-bold mb-6">{dict.about.About_Us}</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{dict.about.our_mission}</p>

      {/* Our Priorities */}
      <h2 className="text-2xl font-semibold mb-6">{dict.about.ustuvorlik}</h2>
      <div className="relative border-l-4 border-blue-500 dark:border-blue-400 pl-8 space-y-10">
        {(["desc1","desc2","desc3","desc4","desc5"] as const).map((key) => (
          <div key={key} className="relative group">
            <span className="absolute -left-[20px] top-[5px] w-4 h-4 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></span>
            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
              {dict.about[key]}
            </h3>
            <div className="absolute -left-[18px] top-2 w-8 h-8 bg-blue-500/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-2">{dict.about.team_title}</h2>
        {dict.about.team_desc && (
          <p className="text-gray-700 dark:text-gray-300">{dict.about.team_desc}</p>
        )}
        <Suspense fallback={<div>Loading team...</div>}>
          <TeamSection locale={locale} dict={dict} />
        </Suspense>
      </div>

      {/* Certificates */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-2">{dict.about.certificates}</h2>
        <p className="text-gray-700 dark:text-gray-300">{dict.about.cert_desc}</p>
        <Suspense fallback={<div>Loading certificates...</div>}>
          <CertificatesSection dict={dict}/>
        </Suspense>
      </div>
    </div>
  );
}
