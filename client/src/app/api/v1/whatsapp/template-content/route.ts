import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const phone_number_id = searchParams.get("phone_number_id");
  const template_name = searchParams.get("template_name");

  // Get the session token with secret
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    return Response.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  if (!phone_number_id || !template_name) {
    return Response.json(
      { success: false, error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/whatsapp/template-content?phone_number_id=${phone_number_id}&template_name=${template_name}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token}`,
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log("API Response:", data); // Debug log

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          error: data.detail || "Failed to fetch template content",
        },
        { status: response.status }
      );
    }

    // The data is already in the correct format from the FastAPI backend
    return Response.json({
      success: true,
      template: data,
    });
  } catch (error) {
    console.error("Template content fetch error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch template content",
      },
      { status: 500 }
    );
  }
}
