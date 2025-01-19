import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error("Missing API configuration");
    }

    const response = await fetch(`${apiUrl}/api/v1/whatsapp/templates`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch templates");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[TEMPLATES_FETCH]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error",
      { status: 500 }
    );
  }
}
