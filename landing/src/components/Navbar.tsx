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

  const { isAuthenticated, user, logout, loadUser } = useAuthStore()

  useEffect(() => {
    loadUser()
    setMounted(true)
  }, [loadUser])

  const navItems = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}/news`, label: dict.nav.blog },
    { href: `/${locale}/vacancies`, label: dict.nav.vacancies },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push(`/${locale}/login`)
  }



  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const { theme, setTheme } = useTheme()

  const changeLanguage = (newLocale: Locale) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    router.push(newPath)
  }

  if (!mounted) {
    return (
      <div className={`p-2 ${isScrolled ? 'text-white' : 'text-gray-700'}`}>
        <Moon className="w-4 h-4 opacity-0" />
      </div>
    )
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'backdrop-blur-md bg-gray-800/70 h-14 shadow-md' : 'backdrop-blur-3xl h-16'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-3">
          <div
            className={`relative transition-all duration-300 ${
              isScrolled ? 'w-12 h-12' : 'w-14 h-14'
            }`}
          >
            {theme === 'light' ? (
              <Image
                src="/icon.png"
                alt="Security Developer dark logo image"
                fill
                sizes="100"
                className="object-contain"
                priority
              />
            ) : (
              <Image
                src="/white-icon.png"
                alt="Security Developer light logo image"
                fill
                sizes="100"
                className="object-contain"
                priority
              />
            )}
            {theme === 'light' && isScrolled && (
              <Image
                src="/white-icon.png"
                alt="Security Developer light logo image"
                fill
                sizes="100"
                className="object-contain"
                priority
              />
            )}
          </div>
          <span
            className={`text-lg font-semibold transition-all duration-300 ${
              isScrolled ? 'text-white text-base' : 'text'
            }`}
          >
            <span className="hidden xl:inline">Security Developer</span>
            <span className="xl:hidden">SecDev</span>
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center space-x-0">
          {/* 👇 Nav-links faqat LG va undan katta ekranlarda */}
          <nav className="hidden lg:flex items-center relative">
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
                    isScrolled={isScrolled}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
              )
            })}
          </nav>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 cursor-pointer ${
              isScrolled ? 'text-white hover:text-[#ff4500]' : 'text-gray-700 hover:text-[#ff4500]'
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-white hover:text-[#ff4500]" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Language dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center cursor-pointer space-x-1 ${
                  isScrolled ? 'text-white hover:text-[#e03d00]' : ' hover:text-[#e03d00]'
                }`}
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

          {/* Login / User avatar — har doim 1024px da ham ko‘rinadi */}
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
                  className={`hidden md:flex items-center cursor-pointer space-x-1 hover:text-[#ff4500] ${
                    isScrolled ? 'text-white' : ''
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{dict.auth.login}</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu toggle (faqat <1024px da) */}
          <div className="flex lg:hidden items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className={`p-2 hover:text-[#ff4500] ${isScrolled && 'text-white'}`}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu (nav links faqat menu ochilganda chiqadi) */}
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

      <AnimatePresence>
        {isScrolled && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        )}
      </AnimatePresence>
    </motion.header>
  )
}
