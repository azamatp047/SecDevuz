// lib/i18n/dictionaries.ts
import 'server-only' 

import type { Locale } from './config'

// Har bir til faylini dinamik ravishda import qilish
const dictionaries = {
  en: () => import('../../messages/en.json').then((module) => module.default),
  ru: () => import('../../messages/ru.json').then((module) => module.default),
  uz: () => import('../../messages/uz.json').then((module) => module.default),
}

// getDictionary funksiyasi
export const getDictionary = async (locale: Locale) => {
  const dictionaryLoader = dictionaries[locale] || dictionaries['uz'];
  return dictionaryLoader();
}

export type Dictionary = Awaited<ReturnType<typeof dictionaries['uz']>>; // 'uz' tilining tuzilishini asos qilib olamiz