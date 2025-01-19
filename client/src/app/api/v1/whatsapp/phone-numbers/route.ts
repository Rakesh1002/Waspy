import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API_URL not configured");
    }

    const response = await fetch(`${apiUrl}/api/v1/whatsapp/phone-numbers`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to fetch phone numbers");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[PHONE_NUMBERS_FETCH]", error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500 }
    );
  }
}
