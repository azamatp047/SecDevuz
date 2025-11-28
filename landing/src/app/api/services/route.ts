// app/api/services/route.ts
import { NextResponse } from "next/server"; // Import NextResponse
import api from "@/lib/api";

export interface ServiceCategory {
  id: number;
  name: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  category: ServiceCategory;
  created_at: string;
  image: string;
  description: string;
}

export interface ServicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceItem[];
}

export const serviceService = {
  getLimitedServices: async (locale: string, limit: number = 3): Promise<ServicesResponse> => {
    const langPrefix = (locale && locale !== 'uz') ? `/${locale}` : '';
    const res = await api.get(`${langPrefix}/v1/services/?limit=${limit}`);
    return res.data;
  },
  getServiceById: async (id: number, locale: string): Promise<ServiceItem> => {
    const langPrefix = (locale && locale !== 'uz') ? `/${locale}` : '';
    const res = await api.get(`${langPrefix}/v1/services/${id}/`);
    return res.data;
  },
  getAllServices: async (locale: string): Promise<ServicesResponse> => {
    const langPrefix = (locale && locale !== 'uz') ? `/${locale}` : '';
    const res = await api.get(`${langPrefix}/v1/services/`);
    return res.data;
  },
  applyForService: async (payload: { service: number; note: string; phone: string }) => {
    const res = await api.post(
      "/v1/services/use-services/",
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

    let services;
    if (id) {
      services = await serviceService.getServiceById(Number(id), locale);
    } else if (limit) {
      services = await serviceService.getLimitedServices(locale, Number(limit));
    } else {
      services = await serviceService.getAllServices(locale);
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// Add a POST handler for applying for a service
export async function POST(req: Request) {
  try {
    const payload: { service: number; note: string; phone: string } = await req.json();
    const response = await serviceService.applyForService(payload);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error applying for service:", error);
    return NextResponse.json(
      { message: "Failed to apply for service" },
      { status: 500 }
    );
  }
}