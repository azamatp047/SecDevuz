// app/[locale]/login/page.tsx
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Locale } from "@/lib/i18n/config";
import LoginClientPage from "../../../components/auth/LoginClientPage";
import { Suspense } from "react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface LoginPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <LoginClientPage dict={dict} locale={locale} />
    </Suspense>
  );
}