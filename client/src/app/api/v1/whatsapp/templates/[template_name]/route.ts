import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ template_name: string }> }
) {
  try {
    const { template_name } = await params;
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

    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/whatsapp/templates/${template_name}`
    );
    url.searchParams.append(
      "phone_number_id",
      process.env.NEXT_PUBLIC_PHONE_NUMBER_ID || ""
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json(
        { success: false, error: error.detail || "Failed to fetch template" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("[TEMPLATE_GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ template_name: string }> }
) {
  try {
    const { template_name } = await params;
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

    const body = await request.json();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/whatsapp/templates/${template_name}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return Response.json(
        { success: false, error: data.detail || "Failed to update template" },
        { status: response.status }
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("[TEMPLATE_UPDATE]", error);
    return Response.json(
      { success: false, error: "Failed to update template" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ template_name: string }> }
) {
  try {
    const { template_name } = await params;
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/whatsapp/templates/${template_name}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return Response.json(
        { success: false, error: data.detail || "Failed to delete template" },
        { status: response.status }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("[TEMPLATE_DELETE]", error);
    return Response.json(
      { success: false, error: "Failed to delete template" },
      { status: 500 }
    );
  }
}
