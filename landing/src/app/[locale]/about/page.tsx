import CertificatesSection from "@/components/about/CertificatesSection"
import TeamSection from "@/components/about/TeamSection"
import { Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { Suspense } from "react"

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  const timeline = [
    { year: dict.about["2010"], desc: dict.about["2010_desc"] },
    { year: dict.about["2015"], desc: dict.about["2015_desc"] },
    { year: dict.about["2020"], desc: dict.about["2020_desc"] },
    { year: dict.about["2023"], desc: dict.about["2023_desc"] },
  ]

  return (
    <div className="container mx-auto px-4 pt-[66px]">
      <h1 className="text-4xl font-bold mb-6 ">
        {dict.about.About_Us}
      </h1>

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-16">
        {dict.about.our_mission}
      </p>

      {/* --- Timeline --- */}
      <div className="relative border-l-4 border-blue-500 dark:border-blue-400 pl-8 space-y-10">
        {timeline.map((item, i) => (
          <div key={i} className="relative group">
            {/* Marker */}
            <span className="absolute -left-[20px] top-[5px] w-4 h-4 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></span>

            {/* Year */}
            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
              {item.year}
            </h3>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300">
              {item.desc}
            </p>

            {/* Decorative glow */}
            <div className="absolute -left-[18px] top-2 w-8 h-8 bg-blue-500/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>

      {/* --- Team --- */}
      <div className="mt-16 ">
        <h2 className="text-2xl font-semibold mb-2">{dict.about.team_title}</h2>
        {dict.about.team_desc && (
          <p className="text-gray-700 dark:text-gray-300">
            {dict.about.team_desc}
          </p>
        )}
        <Suspense fallback={<div>Loading team...</div>}>
          <TeamSection locale={locale} />
        </Suspense>
      </div>

      {/* --- Certificates --- */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-2">{dict.about.certificates}</h2>
        <p className="text-gray-700 dark:text-gray-300">
          {dict.about.cert_desc}
        </p>
        <Suspense fallback={<div>Loading certificates...</div>}>
          <CertificatesSection />
        </Suspense>
      </div>
    </div>
  )
}