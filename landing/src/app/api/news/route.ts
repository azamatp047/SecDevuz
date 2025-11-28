// app/api/news/route.ts
import { NextResponse } from "next/server"; // Import NextResponse
import api from "@/lib/api";

export interface BlogPostItem {
  id: number;
  title: string;
  image?: string;
  body?: string;
  created_at?: string;
}

export interface BlogPostsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlogPostItem[];
}

export const newsService = {
  getLimitedPosts: async (locale: string, limit: number = 3): Promise<BlogPostsResponse> => {
    const langPrefix = locale && locale !== "uz" ? `/${locale}` : "";
    const res = await api.get(`${langPrefix}/v1/blog/landing/blog-posts/?limit=${limit}`);
    return res.data;
  },

  getAllPosts: async (locale: string): Promise<BlogPostsResponse> => {
    const langPrefix = locale && locale !== "uz" ? `/${locale}` : "";
    const res = await api.get(`${langPrefix}/v1/blog/landing/blog-posts/`);
    return res.data;
  },

  getPostById: async (id: number, locale: string): Promise<BlogPostItem> => {
    const langPrefix = locale && locale !== "uz" ? `/${locale}` : "";
    const res = await api.get(`${langPrefix}/v1/blog/landing/blog-posts/${id}/`);
    return res.data;
  },
};

// Add a GET handler for your API route
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "uz"; // Default to 'uz'
    const limit = searchParams.get("limit");
    const id = searchParams.get("id"); // If you want to fetch by ID from this route

    let posts;
    if (id) {
      posts = await newsService.getPostById(Number(id), locale);
    } else if (limit) {
      posts = await newsService.getLimitedPosts(locale, Number(limit));
    } else {
      posts = await newsService.getAllPosts(locale);
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// If you have dynamic routes like /api/news/[id], you'd handle getPostById there.
// For now, I've included a way to fetch by ID using a query param, but a separate dynamic route is often cleaner for single item fetching.