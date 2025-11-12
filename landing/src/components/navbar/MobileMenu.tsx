'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { UserProfile } from '@/store/authStore' // UserProfile ni import qilish

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  navItems: { href: string; label: string }[];
  isAuthenticated: boolean;
  handleLogout: () => void;
  logoutText: string;
  loginText: string;
  user: UserProfile | null; // UserProfile tipida user ni qabul qilish
}

export function MobileMenu({
  isOpen,
  onClose,
  pathname,
  navItems,
  isAuthenticated,
  handleLogout,
  logoutText,
  loginText,
  user, // user propini qabul qilish
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="lg:hidden bg-amber-50 dark:bg-blue-950 border-t border-border shadow-lg absolute w-full left-0 top-16 z-40"
        >
          <div className="flex flex-col p-4 space-y-2">
            {isAuthenticated && user && ( // Agar foydalanuvchi tizimda bo'lsa va user ma'lumotlari mavjud bo'lsa
              <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md mb-2">
                <User className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">
                  {user.first_name} {user.last_name}
                </span>
              </div>
            )}

            {navItems.map((item: any) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`block text-sm py-2 ${
                  pathname === item.href
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  handleLogout()
                  onClose()
                }}
              >
                {logoutText}
              </Button>
            ) : (
              <Link href="/login" onClick={onClose}>
                <Button className="w-full mt-2">
                  <User className="w-4 h-4 mr-2" /> {loginText}
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}