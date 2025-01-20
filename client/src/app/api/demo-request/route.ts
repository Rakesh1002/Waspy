import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, phone, useCase } = body;

    const demoRequest = await prisma.demoRequest.create({
      data: {
        name,
        email,
        company,
        phone,
        useCase,
      },
    });

    return NextResponse.json(demoRequest);
  } catch (error) {
    console.error("Failed to create demo request:", error);
    return NextResponse.json(
      { error: "Failed to create demo request" },
      { status: 500 }
    );
  }
}
