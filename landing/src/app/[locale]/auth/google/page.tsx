'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Locale } from '@/lib/i18n/config'

interface LocaleTexts {
    checking: string
    redirecting: string
    error: string
}

const localeTexts: Record<Locale, LocaleTexts> = {
    uz: {
        checking: "Google orqali tekshirilmoqda...",
        redirecting: "Yo‘naltirilmoqda...",
        error: "Xatolik yuz berdi. Iltimos qayta urinib ko‘ring."
    },
    ru: {
        checking: "Проверка через Google...",
        redirecting: "Перенаправление...",
        error: "Произошла ошибка. Попробуйте снова."
    },
    en: {
        checking: "Checking with Google...",
        redirecting: "Redirecting...",
        error: "An error occurred. Please try again."
    }
}

export default function GoogleCallbackPage({ params }: { params: { locale: Locale } }) {
    const { locale } = params
    const router = useRouter()
    const query = useSearchParams()

    const loginGoogle = useAuthStore((s) => s.loginWithGoogle)
    const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading')

    useEffect(() => {
        const code = query.get('code')

        if (!code) {
            setStatus('error')
            setTimeout(() => router.replace(`/${locale}/login`), 1200)
            return
        }

        const redirect_uri = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${locale}/auth/google`

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login/google/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, redirect_uri }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.access_token && data.refresh_token) {
                    setStatus('redirecting')
                    loginGoogle(data.access_token, data.refresh_token)
                    setTimeout(() => router.replace(`/${locale}`), 600)
                } else {
                    setStatus('error')
                    setTimeout(() => router.replace(`/${locale}/login`), 1200)
                }
            })
            .catch(() => {
                setStatus('error')
                setTimeout(() => router.replace(`/${locale}/login`), 1200)
            })
    }, [query, locale, router, loginGoogle])


    const t = localeTexts[locale]

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black">
            <div className="flex flex-col items-center p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">

                <div className="flex space-x-2 my-4">
                    <span className="w-7 h-7 bg-blue-500 rounded-full animate-bounce"></span>
                    <span className="w-7 h-7 bg-red-500 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                    <span className="w-7 h-7 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
                    <span className="w-7 h-7 bg-green-500 rounded-full animate-bounce [animation-delay:-0.6s]"></span>
                </div>


                <p className="text-lg font-medium">
                    {status === 'loading' && t.checking}
                    {status === 'redirecting' && t.redirecting}
                    {status === 'error' && t.error}
                </p>

            </div>
        </div>
    )
}
