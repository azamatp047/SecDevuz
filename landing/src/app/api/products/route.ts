// app/api/products/route.ts
import { NextResponse } from "next/server"; // Import NextResponse
import api from "@/lib/api";

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductItem {
  id: number;
  title: string;
  category: ProductCategory;
  image: string;
  description: string;
  price: string;
}

export interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductItem[];
}

export const productService = {
  getLimitedProducts: async (locale: string, limit: number = 3): Promise<ProductsResponse> => {
    const langPrefix = (locale && locale !== 'uz') ? `/${locale}` : '';
    const res = await api.get(`${langPrefix}/v1/products/?limit=${limit}`);
    return res.data;
  },
  getProductById: async (id: number, locale: string): Promise<ProductItem> => {
    const langPrefix = (locale && locale !== 'uz') ? `/${locale}` : '';
    const res = await api.get(`${langPrefix}/v1/products/${id}/`);
    return res.data;
  },
  getAllProducts: async (
    locale: string,
    page: number = 1,
    limit: number = 6
  ): Promise<ProductsResponse> => {
    const langPrefix = locale !== "uz" ? `/${locale}` : "";
    const offset = (page - 1) * limit;

    const res = await api.get(`${langPrefix}/v1/products/?limit=${limit}&offset=${offset}`);
    return res.data;
  },

  buyProduct: async (payload: { product: number; phone_number: string }) => {
    const res = await api.post(
      "/v1/products/buy-products/",
      payload
    );
    return res.data;
  },
};

// Add a GET handler for your API route
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "uz";
    const limit = searchParams.get("limit");
    const id = searchParams.get("id");

    let products;
    if (id) {
      products = await productService.getProductById(Number(id), locale);
    } else if (limit) {
      products = await productService.getLimitedProducts(locale, Number(limit));
    } else {
      products = await productService.getAllProducts(locale);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// Add a POST handler for buying a product
export async function POST(req: Request) {
  try {
    const payload: { product: number; phone_number: string } = await req.json();
    const response = await productService.buyProduct(payload);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error buying product:", error);
    return NextResponse.json(
      { message: "Failed to buy product" },
      { status: 500 }
    );
  }
}