import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    // Add authentication check
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();

    console.debug("[WHATSAPP_SEND] Request body:", body);

    const apiUrl = process.env.API_URL;
    const apiKey = process.env.API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error("Missing API configuration");
    }

    // Make the API call
    const response = await fetch(`${apiUrl}/api/v1/whatsapp/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Get response as text first
    const responseText = await response.text();
    console.debug("[WHATSAPP_SEND] Raw response:", responseText);

    // Try to parse as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { detail: responseText };
    }

    // Log the parsed response
    console.debug("[WHATSAPP_SEND] Parsed response:", responseData);

    if (!response.ok) {
      // Return error response
      return new NextResponse(
        JSON.stringify({
          error: responseData.detail || "Failed to send message",
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("[WHATSAPP_SEND] Error:", error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
