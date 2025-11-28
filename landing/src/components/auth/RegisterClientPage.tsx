'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { Loader2, User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Locale } from '@/lib/i18n/config'

interface RegisterClientPageProps {
  dict: any
  locale: Locale
}

export default function RegisterClientPage({ dict, locale }: RegisterClientPageProps) {
  const { signup, isAuthenticated, loading, error } = useAuthStore()
  const router = useRouter()

  const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
  const base_url = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL!
  const redirect_uri = `${base_url}/${locale}/auth/google`

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  useEffect(() => {
    if (isAuthenticated) router.push(`/${locale}`)
  }, [isAuthenticated, router, locale])

  /** GOOGLE LOGIN */
  const handleGoogleLogin = () => {
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}` +
      `&redirect_uri=${redirect_uri}` +
      `&response_type=code` +
      `&scope=openid%20email%20profile` +
      `&access_type=offline&prompt=consent`

    window.location.href = authUrl
  }

  /** SUBMIT FORM */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      alert(dict.auth.passwordsMismatch)
      return
    }

    const { confirm_password, ...dataToSend } = form
    await signup(dataToSend)
  }

  const isFormValid =
    form.first_name.trim() !== '' &&
    form.last_name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.password.trim() !== '' &&
    form.confirm_password.trim() !== '' &&
    form.password === form.confirm_password

  return (
    <div className="flex justify-center items-center min-h-screen px-4 pt-[64px] bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black ">
      <Card className="w-full max-w-sm shadow-lg border border-gray-300 dark:border-gray-700">

        {/* HEADER */}
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            {dict.auth.register}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* FIRST NAME */}
            <div>
              <Label htmlFor="first_name">{dict.auth.name}</Label>
              <div className="relative">
                <User className="absolute left-2 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="________________"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="pl-8"
                />
              </div>
            </div>

            {/* LAST NAME */}
            <div>
              <Label htmlFor="last_name">{dict.auth.lastName}</Label>
              <div className="relative">
                <User className="absolute left-2 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="________________"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="pl-8"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <Label htmlFor="email">{dict.auth.email}</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="pl-8"
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
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="pl-8 pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <Label htmlFor="confirm_password">{dict.auth.confirmPassword}</Label>
              <div className="relative">
                <Lock className="absolute left-2 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                  className="pl-8 pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {form.password !== form.confirm_password &&
                form.confirm_password !== '' && (
                  <p className="text-red-500 text-xs mt-1">{dict.auth.passwordsMismatch}</p>
                )}
            </div>

            {/* SUBMIT */}
            <Button type="submit" className="w-full" disabled={loading || !isFormValid}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {dict.auth.register}
            </Button>

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

        <CardFooter className="text-center text-sm text-gray-500">
          {dict.auth.alreadyHaveAccount}{'*'}
          <Link href={`/${locale}/login`} className="text-blue-500 hover:underline">
            {dict.auth.login}
          </Link>
        </CardFooter>

      </Card>
    </div>
  )
}
