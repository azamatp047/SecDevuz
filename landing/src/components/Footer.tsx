'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Phone, Globe, Instagram, Send } from 'lucide-react'
import { Locale } from '@/lib/i18n/config'

interface FooterProps {
  locale: Locale
  dict: any
}

export default function Footer({ locale, dict }: FooterProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const navLinks = [
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}/news`, label: dict.nav.blog },
    { href: `/${locale}/vacancies`, label: dict.nav.vacancies },
  ]

  const socialLinks = [
    { icon: <Instagram className="w-8 h-8" />, href: 'https://www.instagram.com/secdev_uz' },
    { icon: <Send className="w-8 h-8" />, href: 'https://t.me/SecDev_uz' },
  ]

  return (
    <footer className="relative w-full mt-10 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo */}
        <div className="flex flex-col space-y-4">
          <div className="relative w-14 h-14">
            {!mounted ? (
              // SSR uchun default logo
              <Image
                src="/icon.png"
                alt="Security Developer Logo"
                fill
                sizes="100"
                className="object-contain"
                priority
              />
            ) : theme === 'light' ? (
              <Image
                src="/icon.png"
                alt="Security Developer Logo"
                fill
                sizes="100"
                className="object-contain"
                priority
              />
            ) : (
              <Image
                src="/white-icon.png"
                alt="Security Developer Dark Logo"
                fill
                sizes="100"
                className="object-contain"
                priority
              />
            )}
          </div>
          <p className="text-sm max-w-xs leading-relaxed">{dict.hero.subtitle}</p>

          <div className="flex items-center space-x-4">
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="text-gray-600 dark:text-gray-300 hover:text-[#ff4500] transition"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-800 dark:text-white">
            {dict.hero.ourServices}
          </h3>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-[#ff4500] transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-800 dark:text-white">
            {dict.nav.contact}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#ff4500]" />
              <a href="mailto:info@securitydev.com" className="hover:underline">
                info@securitydev.com
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-[#ff4500]" />
              <a href="tel:+998901234567" className="hover:underline">
                +998 (90) 123-45-67
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#ff4500]" />
              <span>Tashkent, Uzbekistan</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 py-4 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} <span className="font-semibold text-[#ff4500]">Security Developer</span>. {locale === 'uz' ? 'Barcha huquqlar himoyalangan.' : 'All rights reserved.'}
        </p>
      </div>
    </footer>
  )
}