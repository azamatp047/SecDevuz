// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import i18n from './src/lib/i18n/config';

const locales = i18n.locales;
const defaultLocale = i18n.defaultLocale;

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages([...locales]);
  const matched = matchLocale(languages, [...locales], defaultLocale);
  return matched;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Statik fayllarni o'tkazib yuboramiz
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/');
  const currentLocale = segments[1];

  // 1️⃣ Agar locale noto‘g‘ri bo‘lsa (masalan /fr, /abc) → /uz ga o‘tkazamiz
  if (!locales.includes(currentLocale as any)) {
    const url = request.nextUrl.clone();

    // Agar URL '/' bilan tugasa, to‘g‘ri formatda biriktiramiz
    url.pathname = `/${defaultLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
    return NextResponse.redirect(url);
  }

  // 2️⃣ Agar locale umuman bo‘lmasa (masalan /about) → avtomatik foydalanuvchi tiliga
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const redirectPath = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // 3️⃣ Auth tekshiruvi
  const accessToken = request.cookies.get('access')?.value;
  const protectedPaths = ['/profile', '/dashboard', '/settings'];

  const isProtected = locales.some((locale) =>
    protectedPaths.some((path) => pathname.startsWith(`/${locale}${path}`))
  );

  if (isProtected && !accessToken) {
    const locale = pathname.split('/')[1] || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // ❗ Bu joy muhim — middleware doimo barcha route’larda ishga tushadi
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
