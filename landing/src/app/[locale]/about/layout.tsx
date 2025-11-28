// app/[locale]/about/layout.tsx
import { ReactNode } from "react";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Metadata } from "next"; // Type qo'shildi

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL;

export const dynamic = "force-dynamic";

// 1-O'zgarish: params tipi Promise<{ locale: string }> bo'lishi kerak
type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 2-O'zgarish: params ni await qilish kerak
  const { locale } = await params;

  // Dict ni olish
  const dict = await getDictionary(locale as Locale);

  return {
    title: dict.about?.metatitle || "About Us - Security Developer",
    description: dict.about?.metadesc || "Learn about our mission, team, and certificates.",
    alternates: {
      canonical: `${DOMAIN}/${locale}/about`,
      languages: {
        uz: `${DOMAIN}/uz/about`,
        en: `${DOMAIN}/en/about`,
        ru: `${DOMAIN}/ru/about`,
      },
    },
    openGraph: {
      title: dict.about?.metatitle || "About Us - Security Developer",
      description: dict.about?.metadesc || "Learn about our mission, team, and certificates.",
      url: `${DOMAIN}/${locale}/about`,
      siteName: "Security Developer",
      images: [
        {
          url: "/logo.jpg", 
          width: 1200,
          height: 630,
          alt: "About Us OG Image",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.about?.metatitle || "About Us - Security Developer",
      description: dict.about?.metadesc || "Learn about our mission, team, and certificates.",
      images: ["/logo.jpg"],
    },
  };
}

export default async function AboutLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}