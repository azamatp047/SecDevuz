// app/[locale]/layout.tsx
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

// Force all pages to render dynamically - fixes useSearchParams() errors
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    return {
      title: "Security Developer",
      description: "Corporate technology company website",
    };
  }

  const dict = await getDictionary(locale as Locale);
  return {
    title: (dict as any).metadata?.title || "Security Developer",
    description:
      (dict as any).metadata?.description ||
      "Corporate technology company website",
    icons: {
      icon: [{ url: "/white-icon.png", type: "image/png" }],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}`])),
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

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

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
        </Providers>
      </body>
    </html>
  );
}