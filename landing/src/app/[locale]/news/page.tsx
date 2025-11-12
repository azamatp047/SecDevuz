import { Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { newsService } from "@/app/api/news/route"
import NewsClient from "@/components/news/NewsClient"

export default async function NewsPage(props: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const data = await newsService.getAllPosts(locale)

  return <NewsClient locale={locale} dict={dict} data={data.results} />
}
