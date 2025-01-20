"use client";

import { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

const demoRequestSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    )
    .max(255, "Email is too long"),

  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name is too long")
    .regex(
      /^[a-zA-Z0-9\s\-&.]+$/,
      "Company name can only contain letters, numbers, spaces, and basic punctuation"
    ),

  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid phone number (E.164 format, e.g., +1234567890)"
    )
    .optional()
    .or(z.literal("")),

  useCase: z
    .string()
    .min(10, "Please provide more details about your use case")
    .max(1000, "Use case description is too long")
    .regex(
      /^[\w\s.,!?()-]+$/,
      "Use case can only contain letters, numbers, and basic punctuation"
    ),
});

type DemoRequest = z.infer<typeof demoRequestSchema>;

export function DemoRequestModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof DemoRequest, string>>
  >({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: (formData.get("name") as string).trim(),
      email: (formData.get("email") as string).trim().toLowerCase(),
      company: (formData.get("company") as string).trim(),
      phone: (formData.get("phone") as string).trim(),
      useCase: (formData.get("useCase") as string).trim(),
    };

    try {
      // Validate the data
      const validatedData = demoRequestSchema.parse(data);

      // If phone is empty string, set it to undefined
      if (validatedData.phone === "") {
        validatedData.phone = undefined;
      }

      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 2000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof DemoRequest, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof DemoRequest] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
        <DialogContent className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-background rounded-lg shadow-lg w-full max-w-lg">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 flex flex-col items-center justify-center space-y-4"
              >
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <h3 className="text-xl font-semibold">Thank you!</h3>
                <p className="text-center text-muted-foreground">
                  Your demo request has been submitted successfully. We&apos;ll be in
                  touch shortly!
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 space-y-6"
              >
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-bold tracking-tight">
                    Request a Demo
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    See how our AI-powered WhatsApp solution can transform your
                    business communication.
                  </DialogDescription>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder="John Doe"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Work Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@company.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium">
                        Company Name
                      </label>
                      <Input
                        id="company"
                        name="company"
                        required
                        placeholder="Company Inc."
                        className={errors.company ? "border-red-500" : ""}
                      />
                      {errors.company && (
                        <p className="text-sm text-red-500">{errors.company}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="useCase" className="text-sm font-medium">
                      Tell us about your use case
                    </label>
                    <Textarea
                      id="useCase"
                      name="useCase"
                      required
                      placeholder="What are you looking to achieve with our platform?"
                      rows={4}
                      className={errors.useCase ? "border-red-500" : ""}
                    />
                    {errors.useCase && (
                      <p className="text-sm text-red-500">{errors.useCase}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Request Demo
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
