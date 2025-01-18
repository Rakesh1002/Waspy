import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTemplateForm } from "@/components/templates/create-template-form";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Breadcrumb, BreadcrumbSeparator, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Create Template | WhatsApp Business",
  description: "Create a new WhatsApp message template",
};

export default function CreateTemplatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex w-full items-center gap-2 px-4 lg:px-8">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Templates</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Template</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
        <div className="mx-auto max-w-4xl space-y-4 p-4 lg:p-8 lg:pt-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Template</h1>
            <p className="text-muted-foreground">
              Create a new WhatsApp message template for your business.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateTemplateForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 