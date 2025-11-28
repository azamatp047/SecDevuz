'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, LogOut, User, Globe, Menu, X, Moon, Sun } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { NavLink } from '@/components/navbar/Navlink'
import { MobileMenu } from '@/components/navbar/MobileMenu'
import { useTheme } from 'next-themes'
import { Locale, locales, localeNames } from '@/lib/i18n/config'
import { useAuthStore } from '@/store/authStore'

export default function Navbar({
  locale,
  dict,
}: {
  locale: Locale
  dict: any
}): React.ReactElement {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // useTheme dan resolvedTheme ni ham olamiz (system rejimini to'g'ri ishlashi uchun)
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  const { isAuthenticated, user, logout, loadUser } = useAuthStore()

  useEffect(() => {
    loadUser()
    setMounted(true)
  }, [loadUser])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}/news`, label: dict.nav.blog },
    { href: `/${locale}/vacancies`, label: dict.nav.vacancies },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ]

  const handleLogout = async () => {
    await logout()
    router.push(`/${locale}/login`)
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const changeLanguage = (newLocale: Locale) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    router.push(newPath)
  }

  // LOGIKANI SODDALASHTIRISH:
  // Qachon oq rangli elementlar (logo, text) kerak?
  // 1. Dark mode bo'lsa.
  // 2. Yoki sahifa pastga scroll qilingan bo'lsa (chunki fon qorayadi).
  const isDarkOrScrolled = (mounted && resolvedTheme === 'dark') || isScrolled;

  // Text rangini dinamik aniqlash
  const textColorClass = isDarkOrScrolled 
    ? 'text-white hover:text-[#ff4500]' 
    : 'text-gray-700 hover:text-[#ff4500]';

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'backdrop-blur-md bg-gray-800/90 h-14 shadow-md dark:bg-gray-900/90' 
          : 'backdrop-blur-sm h-16 bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        
        {/* LOGO QISMI */}
        <Link href={`/${locale}`} className="flex items-center space-x-3">
          <div
            className={`relative transition-all duration-300 ${
              isScrolled ? 'w-10 h-10' : 'w-12 h-12'
            }`}
          >
            {/* Logo src logikasi: Agar dark mode yoki scroll bo'lsa oq logo, aks holda qora logo */}
            <Image
              src={isDarkOrScrolled ? "/white-icon.png" : "/icon.png"}
              alt="Security Developer logo"
              fill
              sizes="100"
              className="object-contain"
              priority
            />
          </div>
          <span
            className={`text-lg font-semibold transition-all duration-300 ${
               isDarkOrScrolled ? 'text-white' : 'text-gray-900'
            }`}
          >
            <span className="hidden xl:inline">Security Developer</span>
            <span className="xl:hidden">SecDev</span>
          </span>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-end">
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center relative mr-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const itemWidth = item.label.length * 9 + 12
              return (
                <div key={item.href} className="relative">
                  <NavLink
                    href={item.href}
                    label={item.label}
                    isActive={isActive}
                    minWidth={itemWidth}
                    isScrolled={isDarkOrScrolled} // Rangi shu prop orqali boshqariladi
                  />
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#000dff]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
              )
            })}
          </nav>

          {/* THEME TOGGLE */}
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-full transition-colors ${textColorClass}`}
            aria-label="Toggle theme"
          >
            {/* Faqat mounted bo'lganda to'g'ri iconni ko'rsatamiz, ungacha bo'sh joy yoki default icon */}
            {mounted ? (
               resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
            ) : (
               <div className="w-5 h-5" /> // Loading paytida sakramasligi uchun bo'sh joy
            )}
          </button>

          {/* Language dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center cursor-pointer ${textColorClass}`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{localeNames[locale]}</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-24 backdrop-blur-sm">
              {locales.map((loc) => (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => changeLanguage(loc)}
                  className={`cursor-pointer ${locale === loc ? 'text-[#ff4500]' : ''}`}
                >
                  {localeNames[loc]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile / Login */}
          <div className="flex">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex relative p-0 w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-[#ff4500] transition-all duration-200"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-[#ff4500] to-orange-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 dark:bg-gray-900 backdrop-blur-sm border"
                >
                  <DropdownMenuItem className="cursor-default">
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-blue-300">
                      {user ? `${user.first_name} ${user.last_name}` : 'Profil'}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {dict.nav.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={`/${locale}/login`} passHref>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`hidden md:flex items-center cursor-pointer space-x-1 ${textColorClass}`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{dict.auth.login}</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className={`p-2 ${textColorClass}`}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        pathname={pathname}
        handleLogout={handleLogout}
        navItems={navItems}
        logoutText={dict.nav.logout}
        loginText={dict.auth.login}
        isAuthenticated={isAuthenticated}
        user={user}
      />
      
      {/* Background overlay for scroll animation */}
      <AnimatePresence>
        {isScrolled && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
            />
        )}
      </AnimatePresence>
    </motion.header>
  )
}