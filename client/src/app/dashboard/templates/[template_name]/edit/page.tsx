import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditTemplateForm } from "@/components/templates/edit-template-form";

export const metadata: Metadata = {
  title: "Edit Template | WhatsApp Business",
  description: "Edit WhatsApp message template",
};

interface PageProps {
  params: Promise<{ template_name: string }>;
}

export default async function EditTemplatePage({ params }: PageProps) {
  const { template_name } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-4xl space-y-4 p-4 lg:p-8 lg:pt-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Template</h1>
            <p className="text-muted-foreground">
              Modify your WhatsApp message template.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent>
              <EditTemplateForm templateName={template_name} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
