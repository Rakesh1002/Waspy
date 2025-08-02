import { prisma } from "@/prisma";
import { contactFormSchema } from "@/lib/schemas/contact";
import {
  sendContactFormNotification,
  sendContactFormConfirmation,
} from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactFormSchema.parse(body);

    // Save to database
    const contact = await prisma.contact.create({
      data: validatedData,
    });

    // Send notification emails (don't block the response if these fail)
    const emailData = {
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
      submittedAt: new Date().toLocaleString("en-US", {
        timeZone: "UTC",
        dateStyle: "full",
        timeStyle: "medium",
      }),
    };

    // Send admin notification
    try {
      await sendContactFormNotification(emailData);
      console.log("Contact form notification sent to admin successfully");
    } catch (emailError) {
      console.error(
        "Failed to send contact notification email to admin:",
        emailError
      );
    }

    // Send user confirmation
    try {
      await sendContactFormConfirmation(emailData);
      console.log("Contact form confirmation sent to user successfully");
    } catch (emailError) {
      console.error(
        "Failed to send contact confirmation email to user:",
        emailError
      );
    }

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
