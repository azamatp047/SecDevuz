// app/api/vacancies/route.ts
import { NextResponse } from "next/server"; // Import NextResponse
import api from "@/lib/api";

export interface VacancyItem {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: string;
}

export interface VacanciesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VacancyItem[];
}

export const vacancyService = {
  getAllVacancies: async (locale: string): Promise<VacanciesResponse> => {
    const langPrefix = locale && locale !== "uz" ? `/${locale}` : "";
    const res = await api.get(`${langPrefix}/v1/vacancies/`);
    return res.data;
  },

  getVacancyById: async (id: number, locale: string): Promise<VacancyItem> => {
    const langPrefix = locale && locale !== "uz" ? `/${locale}` : "";
    const res = await api.get(`${langPrefix}/v1/vacancies/${id}/`);
    return res.data;
  },

  applyToVacancy: async (formData: FormData) => {
    const res = await api.post( "/v1/applications/landing/add-application/", formData );
    return res.data;
  },
};

// Add a GET handler for your API route
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "uz";
    const id = searchParams.get("id");

    let vacancies;
    if (id) {
      vacancies = await vacancyService.getVacancyById(Number(id), locale);
    } else {
      vacancies = await vacancyService.getAllVacancies(locale);
    }

    return NextResponse.json(vacancies);
  } catch (error) {
    console.error("Error fetching vacancies:", error);
    return NextResponse.json(
      { message: "Failed to fetch vacancies" },
      { status: 500 }
    );
  }
}

// Add a POST handler for applying to a vacancy
export async function POST(req: Request) {
  try {
    const formData = await req.formData(); // Parse the request body as FormData
    const response = await vacancyService.applyToVacancy(formData);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error applying to vacancy:", error);
    return NextResponse.json(
      { message: "Failed to apply to vacancy" },
      { status: 500 }
    );
  }
}