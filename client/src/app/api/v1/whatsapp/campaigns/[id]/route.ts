import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;

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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API_URL not configured");
    }

    const response = await fetch(
      `${apiUrl}/api/v1/whatsapp/campaigns/${campaignId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return Response.json(
        { success: false, error: data.detail || "Failed to delete campaign" },
        { status: response.status }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("[CAMPAIGN_DELETE]", error);
    return Response.json(
      { success: false, error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;

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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API_URL not configured");
    }

    const response = await fetch(
      `${apiUrl}/api/v1/whatsapp/campaigns/${campaignId}`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 }, // Disable caching
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          error: data.detail || "Failed to fetch campaign details",
        },
        { status: response.status }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error("[CAMPAIGN_DETAILS]", error);
    return Response.json(
      { success: false, error: "Failed to fetch campaign details" },
      { status: 500 }
    );
  }
}
