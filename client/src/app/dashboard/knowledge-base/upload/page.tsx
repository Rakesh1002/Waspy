"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function KnowledgeBaseUploadPage() {
  return (
    <div className="flex h-full flex-col">
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
                <BreadcrumbPage>Knowledge Base</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Upload Documents</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl space-y-4 p-4 lg:p-8 lg:pt-6">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">Upload Documents</h1>
            <div className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold">Upload a file</h3>
                <p className="mt-1 text-sm text-gray-500">
                  PDF, DOCX, or TXT up to 10MB
                </p>
                <div className="mt-4">
                  <Input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.docx,.txt"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload">Choose file</label>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Document Title
                  </label>
                  <Input placeholder="Enter document title" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Input placeholder="Enter document description" />
                </div>

                <Button className="w-full">Upload Document</Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
