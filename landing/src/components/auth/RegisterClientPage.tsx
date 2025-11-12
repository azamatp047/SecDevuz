// components/auth/RegisterClientPage.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Loader2, User, Mail, Lock, Chrome, UserPlus, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { Locale } from '@/lib/i18n/config' // Locale tipini import qilish

interface RegisterClientPageProps {
  dict: any; // Tarjimalar prop sifatida qabul qilinadi
  locale: Locale; // Locale ham prop sifatida qabul qilinadi
}

export default function RegisterClientPage({ dict, locale }: RegisterClientPageProps) { // Propslarni qabul qilish
  const { signup, isAuthenticated, loading, error } = useAuthStore()
  const router = useRouter()
  // const params = useParams() // Endi params.locale o'rniga locale propidan foydalanamiz
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', confirm_password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  useEffect(() => {
      if (isAuthenticated) router.push(`/${locale}`) // params.locale o'rniga locale propidan foydalanish
    }, [isAuthenticated, router, locale]) // locale ham dependency ga qo'shildi

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      alert(dict.auth.passwordsMismatch); // Tarjima matnini ishlatish
      return;
    }
    const { confirm_password, ...dataToSend } = form;
    await signup(dataToSend)
  }

  const isFormValid = 
    form.first_name.trim() !== '' &&
    form.last_name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.password.trim() !== '' &&
    form.confirm_password.trim() !== '' &&
    form.password === form.confirm_password;

  return (
    <div className="flex justify-center items-center min-h-screen px-4 pt-[64px] bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black ">
      <Card className="w-full max-w-sm shadow-lg border border-gray-300 dark:border-gray-700" >
        <CardHeader>
          {/* dict dan tarjima matnini ishlatish */}
          <CardTitle className="text-center text-2xl font-semibold">{dict.auth.register}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              {/* dict dan tarjima matnini ishlatish */}
              <Label htmlFor="first_name" className='mb-1'>{dict.auth.name}</Label>
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
            <div>
              {/* dict dan tarjima matnini ishlatish */}
              <Label htmlFor="last_name" className='mb-1'>{dict.auth.lastName}</Label>
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
            <div>
              {/* dict dan tarjima matnini ishlatish */}
              <Label htmlFor="email" className='mb-1'>{dict.auth.email}</Label>
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
            <div>
              {/* dict dan tarjima matnini ishlatish */}
              <Label htmlFor="password" className='mb-1'>{dict.auth.password}</Label>
              <div className="relative">
                <Lock className="absolute left-2 top-3 w-4 h-4 text-gray-400" />
                <Input 
                  id="password"
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="********" 
                  value={form.password} 
                  onChange={handleChange} 
                  required 
                  className="pl-8 pr-8"
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
            <div>
              {/* dict dan tarjima matnini ishlatish */}
              <Label htmlFor="confirm_password" className='mb-1'>{dict.auth.confirmPassword}</Label>
              <div className="relative">
                <Lock className="absolute left-2 top-3 w-4 h-4 text-gray-400" />
                <Input 
                  id="confirm_password"
                  name="confirm_password" 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="********" 
                  value={form.confirm_password} 
                  onChange={handleChange} 
                  required 
                  className="pl-8 pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showConfirmPassword ? dict.auth.hidePassword : dict.auth.showPassword} 
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password !== form.confirm_password && form.confirm_password !== '' && (
                <p className="text-red-500 text-xs mt-1">{dict.auth.passwordsMismatch}</p> 
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading || !isFormValid}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
              {dict.auth.register} {/* Tarjima matnini ishlatish */}
            </Button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>

          <Separator className="my-4" />

          <Button variant="outline" className="w-full">
            <Chrome className="w-4 h-4 mr-2" />
            {dict.auth.google_auth} {/* Tarjima matnini ishlatish */}
          </Button>
        </CardContent>
        <CardFooter className="text-center block text-sm text-gray-500">
          {dict.auth.alreadyHaveAccount}{' '} {/* Tarjima matnini ishlatish */}
          <Link href={`/${locale}/login`} className="text-blue-500 hover:underline">
            {dict.auth.login} {/* Tarjima matnini ishlatish */}
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}