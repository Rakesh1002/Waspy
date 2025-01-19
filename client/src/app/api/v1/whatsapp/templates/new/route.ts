import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  try {
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

    // Add required fields for WhatsApp Business API
    const templateData = {
      ...body,
      components: [
        // Header component if provided
        ...(body.header
          ? [
              {
                type: "HEADER",
                format: body.header.format,
                text: body.header.text,
              },
            ]
          : []),
        // Body component is required
        {
          type: "BODY",
          text: body.body,
        },
        // Footer component if provided
        ...(body.footer
          ? [
              {
                type: "FOOTER",
                text: body.footer,
              },
            ]
          : []),
        // Buttons component if provided
        ...(body.buttons && body.buttons.length > 0
          ? [
              {
                type: "BUTTONS",
                buttons: body.buttons,
              },
            ]
          : []),
      ],
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/whatsapp/templates/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token}`,
        },
        body: JSON.stringify(templateData),
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { success: false, error: data.detail || "Failed to create template" },
        { status: response.status }
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("[TEMPLATE_CREATE]", error);
    return Response.json(
      { success: false, error: "Failed to create template" },
      { status: 500 }
    );
  }
}
