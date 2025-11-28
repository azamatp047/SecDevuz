'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { Loader2, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Locale } from '@/lib/i18n/config'

interface LoginClientPageProps {
  dict: any
  locale: Locale
}

export default function LoginClientPage({ dict, locale }: LoginClientPageProps) {
  const { login, isAuthenticated, loading, error } = useAuthStore()

  const router = useRouter()

  const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
  const base_url = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL!

  const redirect_uri = `${base_url}/${locale}/auth/google`

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  /** Already authenticated → home page */
  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/${locale}`)
    }
  }, [isAuthenticated, router, locale])

  /** Google login redirect */
  const handleGoogleLogin = () => {
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}` +
      `&redirect_uri=${redirect_uri}` +
      `&response_type=code` +
      `&scope=openid%20email%20profile` +
      `&access_type=offline&prompt=consent`

    window.location.href = authUrl
  }

  /** Email + Password login */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email.trim(), password.trim())
  }

  const isFormValid = email.trim() !== '' && password.trim() !== ''

  return (
    <div className="flex justify-center items-center min-h-screen pt-[64px] px-4 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black py-10">
      <Card className="w-full max-w-sm shadow-lg border border-gray-300 dark:border-gray-700">
        
        {/* HEADER */}
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            {dict.auth.login}
          </CardTitle>
        </CardHeader>

        {/* FORM */}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <div>
              <Label htmlFor="email">{dict.auth.email}</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  className="pl-8"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <Label htmlFor="password">{dict.auth.password}</Label>
              <div className="relative">
                <Lock className="absolute left-2 top-3 w-4 h-4 text-gray-400" />

                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="pl-8 pr-8"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <Button type="submit" className="w-full" disabled={loading || !isFormValid}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogIn className="w-4 h-4 mr-2" />}
              {dict.auth.login}
            </Button>

            {/* ERROR */}
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          </form>

          <Separator className="my-4" />

          {/* GOOGLE LOGIN */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleGoogleLogin}
          >
            <Image
              src="/google.png"
              alt="Google logo"
              width={20}
              height={20}
              className="mr-2"
            />
            {dict.auth.google_auth}
          </Button>
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="text-center text-sm text-gray-500">
          {dict.auth.dontHaveAccount}{'*'}
          <Link href={`/${locale}/signup`} className="text-blue-500 hover:underline">
            {dict.auth.register}
          </Link>
        </CardFooter>

      </Card>
    </div>
  )
}
