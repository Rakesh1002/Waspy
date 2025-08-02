import { prisma } from "@/prisma";
import {
  sendDemoRequestNotification,
  sendDemoRequestConfirmation,
} from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, phone, useCase } = body;

    // Save to database
    const demoRequest = await prisma.demoRequest.create({
      data: {
        name,
        email,
        company,
        phone,
        useCase,
      },
    });

    // Send notification emails (don't block the response if these fail)
    const emailData = {
      name,
      email,
      company,
      phone,
      useCase,
      submittedAt: new Date().toLocaleString("en-US", {
        timeZone: "UTC",
        dateStyle: "full",
        timeStyle: "medium",
      }),
    };

    // Send admin notification
    try {
      await sendDemoRequestNotification(emailData);
      console.log("Demo request notification sent to admin successfully");
    } catch (emailError) {
      console.error(
        "Failed to send demo request notification email to admin:",
        emailError
      );
    }

    // Send user confirmation
    try {
      await sendDemoRequestConfirmation(emailData);
      console.log("Demo request confirmation sent to user successfully");
    } catch (emailError) {
      console.error(
        "Failed to send demo request confirmation email to user:",
        emailError
      );
    }

    return NextResponse.json(demoRequest);
  } catch (error) {
    console.error("Failed to create demo request:", error);
    return NextResponse.json(
      { error: "Failed to create demo request" },
      { status: 500 }
    );
  }
}
