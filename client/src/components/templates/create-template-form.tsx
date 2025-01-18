"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  category: z.enum(["MARKETING", "UTILITY", "AUTHENTICATION"]),
  language: z.string().min(2, "Language code is required"),
  header: z.object({
    format: z.enum(["TEXT", "IMAGE", "VIDEO", "DOCUMENT"]),
    text: z.string().optional(),
  }).optional(),
  body: z.string().min(1, "Message body is required"),
  footer: z.string().optional(),
  buttons: z.array(
    z.object({
      type: z.enum(["URL", "PHONE_NUMBER", "QUICK_REPLY"]),
      text: z.string(),
      url: z.string().optional(),
      phone_number: z.string().optional(),
    })
  ).optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export function CreateTemplateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      category: "UTILITY",
      language: "en",
      buttons: [],
    },
  });

  async function onSubmit(data: TemplateFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/whatsapp/templates/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create template");
      }

      toast.success("Template created successfully");
      router.push("/dashboard/templates");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create template");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input placeholder="welcome_message" {...field} />
              </FormControl>
              <FormDescription>
                Use lowercase letters, numbers, and underscores only
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                  {/* Add more languages as needed */}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message Body</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your message template..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Use {'{{'}1{'}}'}, {'{{'}2{'}}'}, etc. for variables. Example: Hello {'{{'}1{'}}'}, your order {'{{'}2{'}}'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/templates")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Template"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 