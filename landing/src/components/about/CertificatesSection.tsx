// src/components/CertificatesSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Calendar, X } from "lucide-react";
import { Certificate, certificateService } from "@/app/api/certificates/route";
import AnimatedImage from "../ui/AnimatedImage";

export default function CertificatesSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await certificateService.getCertificates();
        setCertificates(data.results);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] rounded-2xl" />
                <div className="mt-4 h-6 bg-gray-200 rounded w-3/4 dark:bg-gray-900" />
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-950" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-10">
          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(cert.image)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <AnimatedImage
                      src={cert.image}
                      alt={cert.name}
                      objectFit="cover"
                      className="rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                          <svg
                            className="w-8 h-8 text-gray-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 dark:bg-gray-800">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {cert.name}
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 " />
                        <span>
                          <span className="font-medium">Berilgan:</span>{" "}
                          {formatDate(cert.issued_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span>
                          <span className="font-medium">Amal qiladi:</span>{" "}
                          {formatDate(cert.valid_until)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </section>

      {/* Full-screen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div
            className="relative max-w-6xl w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-h-[90vh]">
              <AnimatedImage
                src={selectedImage}
                alt="Certificate"
                objectFit="contain"
                height="h-full"
              />
            </div>
          </div>

          <p className="absolute bottom-6 text-white/70 text-sm">
            Yopish uchun bosing yoki ESC tugmasini bosing
          </p>
        </div>
      )}
    </>
  );
}
