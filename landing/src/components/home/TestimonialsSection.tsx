"use client"

import { testimonialsData } from "@/messages/testimonials"
import TestimonialCard from "./TestimonialCard"

interface TestimonialsSectionProps {
  locale: "uz" | "en" | "ru"
}

export default function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const testimonials = testimonialsData[locale]

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold text-center mb-10">
        {locale === "uz" && "Mijozlar fikrlari"}
        {locale === "en" && "What Our Clients Say"}
        {locale === "ru" && "Отзывы клиентов"}
      </h2>

      <div className="flex flex-wrap justify-center gap-10">
        {testimonials.map((item, idx) => (
          <TestimonialCard
            key={idx}
            name={item.name}
            company={item.company}
            image={item.image}
            text={item.text}
          />
        ))}
      </div>
    </section>
  )
}
