// app/api/contact/route.ts
import { NextResponse } from "next/server"; // Import NextResponse
import api from "@/lib/api";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const contactService = {
  /**
   * 🔹 Kontakt formani yuborish
   * Auth bo‘lmagan user ham yuborishi mumkin.
   */
  sendContactMessage: async (data: ContactFormData): Promise<any> => {
    const res = await api.post(`/v1/comments/landing/add-comment/`, data, {
      headers: {
        "Accept": "application/json",
      },
    });
    return res.data;
  },
};

// Add a POST handler for your API route
export async function POST(req: Request) {
  try {
    const data: ContactFormData = await req.json(); // Parse the request body
    const response = await contactService.sendContactMessage(data);
    return NextResponse.json(response, { status: 200 }); // Return success
  } catch (error) {
    console.error("Error sending contact message:", error);
    return NextResponse.json(
      { message: "Failed to send contact message" },
      { status: 500 }
    );
  }
}