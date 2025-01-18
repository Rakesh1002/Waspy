import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateList } from "@/components/templates/template-list";
import {
  BreadcrumbLink,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Templates | WhatsApp Business",
  description: "Manage your WhatsApp message templates",
};

export default function TemplatesPage() {
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
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="mx-auto max-w-6xl space-y-4 p-4 lg:p-8 lg:pt-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Message Templates
            </h1>
            <p className="text-muted-foreground">
              Create and manage your WhatsApp message templates.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateList />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
