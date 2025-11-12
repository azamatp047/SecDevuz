"use client";

import dynamic from "next/dynamic";

const ContactForm = dynamic(() => import("./ContactForm"), { 
  ssr: false,
  loading: () => (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl text-center">
      <p>Loading contact form...</p>
    </div>
  )
});

export default function ContactFormWrapper({ dict }: { dict: any }) {
  return <ContactForm dict={dict} />;
}
