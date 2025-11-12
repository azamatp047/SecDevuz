import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { newsService, BlogPostItem } from "@/app/api/news/route";
import { notFound } from "next/navigation";
import BackButton from "@/components/buttons/BackButton";
import AnimatedImage from "@/components/ui/AnimatedImage";
import Link from "next/link";

interface NewsDetailPageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const resolvedParams = await params;
  const { locale, id } = resolvedParams;
  const dict = await getDictionary(locale);

  // 1️⃣ Asosiy yangilikni olish
  let post: BlogPostItem | null = null;
  try {
    post = await newsService.getPostById(parseInt(id), locale);
  } catch (error) {
    console.error(`Yangilik (ID: ${id}) yuklashda xatolik:`, error);
    notFound();
  }

  if (!post) notFound();

  // 2️⃣ Qo‘shimcha yangiliklarni olish
  let relatedPosts: BlogPostItem[] = [];
  try {
    const allPosts = await newsService.getAllPosts(locale);
    relatedPosts = allPosts.results
      .filter((p) => p.id !== post?.id) // asosiy yangilikni chiqarma
      .slice(0, 3); // faqat 3 tasini olamiz
  } catch (error) {
    console.error("Qo‘shimcha yangiliklarni yuklashda xatolik:", error);
  }

  return (
    <div className="container mx-auto px-5 pt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* ===== CHAP QISM: Asosiy yangilik ===== */}
      <div className="lg:col-span-2">
        <BackButton />

        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          {post.title}
        </h1>

        {post.created_at && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        )}

        {post.image && (
          <div className="relative w-full h-60 md:h-96 mb-8 rounded-lg overflow-hidden shadow-md">
            <AnimatedImage
              src={post.image}
              alt={String(post.title)}
              className="rounded-lg"
              height="h-full!"
            />
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
          <div dangerouslySetInnerHTML={{ __html: post.body || "" }} />
        </div>

      </div>

      {/* ===== O‘NG QISM: Qo‘shimcha yangiliklar ===== */}
      <aside className="lg:col-span-1">
        <h2 className="text-2xl font-semibold mb-5 text-gray-900 dark:text-white">
          {dict.news.another_news}
        </h2>

        {relatedPosts.length > 0 ? (
          <div className="space-y-6">
            {relatedPosts.map((p) => (
              <Link
                href={`/${locale}/news/${p.id}`}
                key={p.id}
                className="block rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-indigo-950"
              >
                {p.image ? (
                  <AnimatedImage
                    src={p.image}
                    alt={p.title}
                    className="w-full h-[150px] object-cover"
                    height="h-[150px]!"
                  />
                ) : (
                  <div className="w-full h-[150px] flex items-center justify-center bg-gray-200 dark:bg-blue-900 text-gray-500 dark:text-gray-400">
                    {dict.news.no_picture}
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {p.title}
                  </h3>
                  {p.created_at && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            {dict.news.no_news}
          </p>
        )}
      </aside>
    </div>
  );
}
