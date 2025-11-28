import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import ProgressBar from "@/components/ProgressBar";
import Navbar from "@/components/Navbar";
import { Providers } from "../providers";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL; // .env dan olingan

// Force all pages to render dynamically
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  
  // Safely access metadata or provide defaults
  const metadata = (dict as any).metadata;

  if (!locales.includes(locale as Locale)) {
    return {
      title: metadata?.title || "Security Developer",
      description: metadata?.description || "Corporate technology company website",
    };
  }


  

  return {
    title: metadata.title ,
    description: metadata.description,
    icons: {
      icon: [{ url: "/white-icon.png", type: "image/png" }],
    },
    alternates: {
      canonical: `${DOMAIN}/${locale}`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `${DOMAIN}/${loc}`])),
    },
    openGraph: {
      title: metadata.title ,
      description: metadata.description,
      url: `${DOMAIN}/${locale}`,
      siteName: "Security Developer",
      images: [{ url: `/logo.png` }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title ,
      description: metadata.description,
      images: [`/logo.png`],
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  let dict;
  try {
    dict = await getDictionary(locale as Locale);
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error);
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ProgressBar />
          <Navbar locale={locale as Locale} dict={dict} />
          <main>{children}</main>
          <Footer locale={locale as Locale} dict={dict} />
          {/* Schema markup */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Security Developer",
                url: DOMAIN,
                logo: `/logo.jpg`,
                sameAs: [
                  "https://www.instagram.com/secdev_uz",
                  "https://t.me/SecDev_uz",
                ],
              }),
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
