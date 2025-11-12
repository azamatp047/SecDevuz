// src/app/api/team/route.ts
import { NextResponse } from "next/server"; // Import NextResponse
import api from "@/lib/api";

export interface TeamMember {
  full_name: string;
  email: string;
  role: string;
  description: string;
  linked_in_link: string | null;
  telegram_username: string | null;
  extra_contact_link: string | null;
  image: string;
}

export interface TeamResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TeamMember[];
}

export const teamService = {
  getTeam: async (locale: string): Promise<TeamResponse> => {
    const langPrefix = (locale && locale !== "uz") ? `/${locale}` : "";
    const res = await api.get(`${langPrefix}/api/v1/team/landing/team-member-list/`);
    return res.data;
  },
};

// Add a GET handler for your API route
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "uz"; // Default to 'uz'

    const team = await teamService.getTeam(locale);
    return NextResponse.json(team);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { message: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}