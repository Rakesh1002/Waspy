import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateView } from "@/components/templates/template-view";

export const metadata: Metadata = {
  title: "Template Details | WhatsApp Business",
  description: "View WhatsApp message template details",
};

interface PageProps {
  params: Promise<{ template_name: string }>;
}

export default async function TemplateViewPage({ params }: PageProps) {
  // Properly await the params object
  const { template_name } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-4xl space-y-4 p-4 lg:p-8 lg:pt-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Template Details</h1>
            <p className="text-muted-foreground">
              View and manage your WhatsApp message template.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateView templateName={template_name} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 