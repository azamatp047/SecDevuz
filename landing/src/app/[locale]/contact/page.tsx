import { getDictionary } from "@/lib/i18n/dictionaries";
import { Locale } from "@/lib/i18n/config";
import ContactFormWrapper from "@/components/contact/ContactFormWrapper";
import { Suspense } from "react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>; // Changed to Promise
}) {
  const { locale } = await params; // Added await
  const dict = await getDictionary(locale);

  return (
    <section className="container mx-auto px-5 mt-20 py-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        {dict.contact.title}
      </h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left side form */}
        <Suspense fallback={
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl text-center">
            <p>Loading contact form...</p>
          </div>
        }>
          <ContactFormWrapper dict={dict} />
        </Suspense>

        {/* Right side info */}
        <div className="flex flex-col items-center justify-center">
          <img
            src="/contact-us.svg"
            alt="Security Developer Contact Page svg png image"
            className="rounded-xl"
          />
          <div className="mt-6 text-center space-y-1">
            <p className="font-semibold text-lg">{dict.contact.secdev}</p>
            <p className="text-sm text-muted-foreground">
              {dict.contact.address}
            </p>
            <p className="text-sm text-muted-foreground">
              📧 securitydeveloper@mail.com
            </p>
            <p className="text-sm text-muted-foreground">📞 93 130 50 77</p>
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div className="mt-10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d11946.817784791234!2d69.16667365963859!3d41.33868201482338!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDIwJzE5LjIiTiA2OcKwMDknNTkuOSJF!5e0!3m2!1sen!2s!4v1761576641099!5m2!1sen!2s"
          width="100%"
          height="400"
          loading="lazy"
          className="rounded-2xl border dark:border-neutral-700"
        ></iframe>
      </div>
    </section>
  );
}