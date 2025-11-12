'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Loader2, Mail, Lock, LogIn, Chrome, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { Locale } from '@/lib/i18n/config'

interface LoginClientPageProps {
  dict: any
  locale: Locale
}

export default function LoginClientPage({ dict, locale }: LoginClientPageProps) {
  const { login, isAuthenticated, loading, error } = useAuthStore()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) router.push(`/${locale}`)
  }, [isAuthenticated, router, locale])

  // ✅ endi emailni to‘liq yuboradi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email.trim(), password)
  }

  const isFormValid = email.trim() !== '' && password.trim() !== ''

  return (
    <div className="flex justify-center items-center min-h-screen pt-[64px] px-4 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black py-10">
      <Card className="w-full max-w-sm shadow-lg border border-gray-300 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">{dict.auth.login}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-1">{dict.auth.email}</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  className="pl-8"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="mb-1">{dict.auth.password}</Label>
              <div className="relative">
                <Lock className="absolute left-2 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  className="pl-8 pr-8"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? dict.auth.hidePassword : dict.auth.showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !isFormValid}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogIn className="w-4 h-4 mr-2" />}
              {dict.auth.login}
            </Button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>

          <Separator className="my-4" />

          <Button variant="outline" className="w-full">
            <Chrome className="w-4 h-4 mr-2" />
            {dict.auth.google_auth}
          </Button>
        </CardContent>
        <CardFooter className="text-center block text-sm text-gray-500">
          {dict.auth.dontHaveAccount}{' '}
          <Link href={`/${locale}/signup`} className="text-blue-500 hover:underline">
            {dict.auth.register}
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
