// app/[locale]/signup/page.tsx
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Locale } from "@/lib/i18n/config";
import { Suspense } from "react";
import RegisterClientPage from "@/components/auth/RegisterClientPage";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface SignupPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function SignupPage({ params }: SignupPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">{dict.common.loading}</div>
      </div>
    }>
      <RegisterClientPage dict={dict} locale={locale} />
    </Suspense>
  );
}