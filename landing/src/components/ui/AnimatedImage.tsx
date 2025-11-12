"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

interface AnimatedImageProps {
  src?: string | null
  alt: string
  className?: string
  objectFit?: "cover" | "contain"
  height?: string
}

export default function AnimatedImage({
  src,
  alt,
  className = "",
  objectFit = "cover",
  height = "h-[300px]",
}: AnimatedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // 🧩 Agar src bo'sh yoki null bo'lsa — hech narsa chiqarmaymiz
  if (!src) return null

  return (
    <div className={`w-full ${height} ${className}`}>
      <motion.div
        initial={{ opacity: 0.4, scale: 0.98, filter: "blur(12px)" }}
        animate={{
          opacity: isLoaded ? 1 : 0.4,
          scale: isLoaded ? 1 : 0.98,
          filter: isLoaded ? "blur(0px)" : "blur(12px)",
        }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full h-full overflow-hidden"
      >
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse" />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100%"
          onLoad={() => setIsLoaded(true)}
          className={`object-${objectFit} transition-all duration-700 ease-out ${
            isLoaded ? "scale-100 blur-0" : "scale-105 blur-xl"
          }`}
        />
      </motion.div>
    </div>
  )
}
