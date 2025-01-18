"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface TemplateDetails {
  name: string;
  language: string;
  status: string;
  id: string;
  category?: string;
  content: {
    header?: {
      format: string;
      text: string;
    } | null;
    body: string | null;
    footer: string | null;
    buttons: Array<{
      type: string;
      text: string;
      url?: string;
    }>;
  };
}

interface TemplateViewProps {
  templateName: string;
}

export function TemplateView({ templateName }: TemplateViewProps) {
  const [template, setTemplate] = useState<TemplateDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTemplateDetails = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/v1/whatsapp/template-content?template_name=${templateName}&phone_number_id=${process.env.NEXT_PUBLIC_PHONE_NUMBER_ID}`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Failed to fetch template details");
      const { success, template } = await response.json();
      
      if (!success || !template) {
        throw new Error("Template not found");
      }

      setTemplate(template);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load template details");
    } finally {
      setLoading(false);
    }
  }, [templateName]);

  useEffect(() => {
    fetchTemplateDetails();
  }, [fetchTemplateDetails]);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await fetch(`/api/v1/whatsapp/templates/${templateName}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete template");
      }

      toast.success("Template deleted successfully");
      router.push("/dashboard/templates");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete template");
      console.error(error);
    }
  }

  if (loading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{template.name}</h2>
          <div className="flex gap-2 mt-2">
            {template.category && <Badge>{template.category}</Badge>}
            <Badge variant="outline">{template.language}</Badge>
            <Badge variant={template.status === "APPROVED" ? "success" : "secondary"}>
              {template.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/templates/${templateName}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {template?.content.header && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">HEADER</h3>
            <p className="text-muted-foreground">{template.content.header.text}</p>
          </div>
        )}
        {template?.content.body && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">BODY</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {template.content.body}
            </p>
          </div>
        )}
        {template?.content.buttons && template.content.buttons.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">BUTTONS</h3>
            {template.content.buttons.map((button, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Badge variant="outline">{button.type}</Badge>
                <span>{button.text}</span>
                {button.url && (
                  <span className="text-sm text-muted-foreground">
                    ({button.url})
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 