"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Use the same schema as create form
const templateSchema = z.object({
  category: z.enum(["MARKETING", "UTILITY", "AUTHENTICATION"]),
  language: z.string().min(2, "Language code is required"),
  header: z
    .object({
      format: z.enum(["TEXT", "IMAGE", "VIDEO", "DOCUMENT"]),
      text: z.string().optional(),
    })
    .optional(),
  body: z.string().min(1, "Message body is required"),
  footer: z.string().optional(),
  buttons: z
    .array(
      z.object({
        type: z.enum(["URL", "PHONE_NUMBER", "QUICK_REPLY"]),
        text: z.string(),
        url: z.string().optional(),
        phone_number: z.string().optional(),
      })
    )
    .optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface EditTemplateFormProps {
  templateName: string;
}

export function EditTemplateForm({ templateName }: EditTemplateFormProps) {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
  });

  const fetchTemplateDetails = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/v1/whatsapp/templates/${templateName}`
      );
      if (!response.ok) throw new Error("Failed to fetch template details");
      const data = await response.json();

      // Set form values from template data
      form.reset({
        category: data.category,
        language: data.language,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load template details");
    } finally {
      setLoading(false);
    }
  }, [templateName, form]);

  useEffect(() => {
    fetchTemplateDetails();
  }, [fetchTemplateDetails]);

  async function onSubmit(data: TemplateFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/v1/whatsapp/templates/${templateName}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update template");
      }

      toast.success("Template updated successfully");
      router.push(`/dashboard/templates/${templateName}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update template"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields same as create form but with templateName disabled */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UTILITY">Utility</SelectItem>
                  <SelectItem value="MARKETING">Marketing</SelectItem>
                  <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add other form fields similar to create form */}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/templates/${templateName}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
