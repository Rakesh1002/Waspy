import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
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

    // Get phone_number_id from query params
    const { searchParams } = new URL(request.url);
    const phoneNumberId = searchParams.get("phone_number_id");
    if (!phoneNumberId) {
      throw new Error("phone_number_id is required");
    }

    console.log(
      "[VERIFY_REGISTRATION] Checking registration status for phone number:",
      phoneNumberId
    );

    const response = await fetch(
      `${apiUrl}/api/v1/whatsapp/verify-registration/${phoneNumberId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        credentials: "include",
      }
    );

    console.log(
      "[VERIFY_REGISTRATION] Backend response status:",
      response.status
    );
    const data = await response.json();
    console.log("[VERIFY_REGISTRATION] Backend response data:", data);

    if (!response.ok) {
      throw new Error(data.detail || "Failed to verify registration");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[VERIFY_REGISTRATION]", error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500 }
    );
  }
}
