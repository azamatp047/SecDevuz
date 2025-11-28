// src/app/api/certificates/route.ts
import { NextResponse } from "next/server"; // Import NextResponse
import api from "@/lib/api";

export interface Certificate {
  id: number;
  name: string;
  issued_date: string;
  valid_until: string;
  image: string;
  summary: string;
}

export interface CertificatesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Certificate[];
}

export const certificateService = {
  getCertificates: async (): Promise<CertificatesResponse> => {
    const res = await api.get("/v1/certificates/");
    return res.data;
  },
};

// Add a GET handler for your API route
export async function GET() {
  try {
    const certificates = await certificateService.getCertificates();
    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { message: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}