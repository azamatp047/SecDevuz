import { ReactNode } from "react";
import { Metadata } from "next"; // Metadata type qo'shildi
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

// 1. Params tipi Promise bo'lishi kerak
type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 2. Params ni await qilish kerak
  const { locale } = await params;

  // Dictionary ni olish
  const dict = await getDictionary(locale as Locale);

  const domain = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL;

  return {
    title: dict.products?.metatitle || "Products - Security Developer",
    description: dict.products?.metadesc || "Check out our products and solutions.",
    openGraph: {
      title: dict.products?.metatitle || "Products - Security Developer",
      description: dict.products?.metadesc || "Check out our products and solutions.",
      url: `${domain}/${locale}/products`,
      siteName: "Security Developer",
      images: [
        {
          url: "/og-products.png",
          width: 1200,
          height: 630,
          alt: "Products OG Image",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.products?.metatitle || "Products - Security Developer",
      description: dict.products?.metadesc || "Check out our products and solutions.",
      images: ["/og-products.png"],
    },
  };
}

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}