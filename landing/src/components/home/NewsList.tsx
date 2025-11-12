import Link from "next/link";
import { Locale } from "@/lib/i18n/config";
import { newsService, BlogPostItem } from "@/app/api/news/route";
import AnimatedImage from "../ui/AnimatedImage";
import { ArrowRight } from "lucide-react";

interface NewsListProps {
  locale: Locale;
  dict: any;
}

export default async function NewsList({ locale, dict }: NewsListProps) {
  let posts: BlogPostItem[] = [];
  let errorFetchingNews: string | null = null;

  try {
    const response = await newsService.getLimitedPosts(locale);
    posts = response.results;
  } catch (error: any) {
    console.error("News yuklashda xatolik:", error);
    errorFetchingNews = "Yangiliklarni yuklashda xatolik yuz berdi.";
  }

  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold mb-6">{dict.news.latest_news}</h2>

      {errorFetchingNews ? (
        <p className="text-red-500 dark:text-red-400">{errorFetchingNews}</p>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link href={`/${locale}/news/${post.id}`} key={post.id}>
                <div className="group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col h-full">
                  {post.image ? (
                    <AnimatedImage
                      src={post.image}
                      alt={post.title}
                      className="rounded-t-lg! w-full object-cover"
                      height="h-[200px]!"
                    />
                  ) : (
                    <div className="w-full h-[200px] flex items-center justify-center bg-gray-200 dark:bg-blue-900 text-gray-500 dark:text-gray-400">
                      {dict.news.no_picture}
                    </div>
                  )}

                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:underline">
                      {post.title}
                    </h3>
                    {post.created_at && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-md"
            >
              {dict.news.see_all}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">{dict.news.no_news}</p>
      )}
    </div>
  );
}
