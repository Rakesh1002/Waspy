import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      )
    }

    const apiUrl = process.env.API_URL
    if (!apiUrl) {
      throw new Error("API_URL not configured")
    }

    console.log("[ACCOUNT_REGISTER] Forwarding request to backend")
    const body = await request.json()
    console.log("[ACCOUNT_REGISTER] Request body:", body)

    const response = await fetch(`${apiUrl}/api/v1/whatsapp/account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    console.log("[ACCOUNT_REGISTER] Backend response status:", response.status)
    const data = await response.json()
    console.log("[ACCOUNT_REGISTER] Backend response data:", data)

    if (!response.ok) {
      throw new Error(data.detail || "Failed to register account")
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[ACCOUNT_REGISTER]", error)
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal server error" 
      }),
      { status: 500 }
    )
  }
} 