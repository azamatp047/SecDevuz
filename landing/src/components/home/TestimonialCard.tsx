"use client"

import { motion } from "framer-motion"
import { Star, Heart } from "lucide-react"
import Image from "next/image"

interface TestimonialCardProps {
  name: string
  company: string
  image: string
  text: string
}

export default function TestimonialCard({
  name,
  company,
  image,
  text,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative bg-cyan-50 shadow-lg max-w-sm p-6 rounded-br-xl rounded-tl-[3rem] rounded-tr-lg rounded-bl-lg"
    >
      {/* Rasm */}
      <div className="relative -left-[14%] top-6">
        <Image
          src={image}
          alt={name}
          width={120}
          height={120}
          className="rounded-full w-30 h-30 border-4 border-white shadow-xl"
        />
      </div>

      {/* Yulduzlar */}
      <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={18} className="text-blue-500 fill-blue-500" />
        ))}
      </div>

      {/* Text */}
      <p className="text-gray-700 text-sm leading-relaxed mb-5 text-justify">
        {text}
      </p>

      {/* Foydalanuvchi ismi va kompaniya */}
      <div className="text-center">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{company}</p>
      </div>

      {/* Pastda heart va “Testimonials” */}
      <div className="flex justify-center items-center gap-2 mt-4 text-gray-600">
        <Heart size={18} className="text-red-500 fill-red-500" />
        <span className="font-medium">Testimonials</span>
      </div>
    </motion.div>
  )
}
