"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TemplateComponent {
  type: string;
  text?: string;
  format?: string;
  example?: string;
}

interface Template {
  name: string;
  category: string;
  language: string;
  status: string;
  components: TemplateComponent[];
}

export function TemplateList() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const response = await fetch("/api/v1/whatsapp/templates");
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      setTemplates(Object.values(data.templates || {}));
    } catch (error) {
      toast.error("Failed to load templates");
      console.error(error);
    }
  }

  async function deleteTemplate(templateName: string) {
    try {
      const response = await fetch(
        `/api/v1/whatsapp/templates/${templateName}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete template");
      }

      toast.success("Template deleted successfully");
      fetchTemplates(); // Refresh the list
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete template"
      );
      console.error(error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Templates</h2>
          <p className="text-sm text-muted-foreground">
            Manage your WhatsApp message templates
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/templates/new")}>
          <Plus className="mr-2 h-4 w-4" /> Create Template
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.name}>
                <TableCell className="font-medium">{template.name}</TableCell>
                <TableCell>{template.category}</TableCell>
                <TableCell>{template.language}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      template.status === "APPROVED" ? "success" : "secondary"
                    }
                  >
                    {template.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/dashboard/templates/${template.name}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/dashboard/templates/${template.name}/edit`
                        )
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this template?"
                          )
                        ) {
                          deleteTemplate(template.name);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
