export const locales = ['uz', 'en', 'ru'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'uz'

export const localeNames: Record<Locale, string> = {
  uz: 'UZ',
  en: 'EN',
  ru: 'RU',
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// Agar boshqa fayllarda `import i18n from ...` qilmoqchi bo‘lsang, shu joyda default export qo‘sh:
const i18n = {
  locales,
  defaultLocale,
  localeNames,
}
export default i18n
