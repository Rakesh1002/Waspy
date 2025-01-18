"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

    export default function BillingSettingsPage() {
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
                <BreadcrumbPage>Billing</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl space-y-4 p-4 lg:p-8 lg:pt-6">
          {/* Current Plan */}
          <Card className="p-6">
            <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
            <div className="space-y-2">
              <p className="text-2xl font-bold">Professional</p>
              <p className="text-gray-500">$49/month</p>
              <p className="text-sm text-gray-500">Billed monthly</p>
            </div>
          </div>
          <Button variant="outline">Change Plan</Button>
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6" />
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/2024</p>
            </div>
          </div>
          <Button variant="outline">Update</Button>
        </div>
      </Card>

      {/* Usage & Limits */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Usage & Limits</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Messages Sent</p>
              <p className="text-sm text-gray-500">8,542 / 10,000</p>
            </div>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Storage Used</p>
              <p className="text-sm text-gray-500">2.1 GB / 5 GB</p>
            </div>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-2/5 h-full bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Billing History */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Billing History</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">March 2024</p>
              <p className="text-sm text-gray-500">Professional Plan</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">$49.00</span>
              <Button variant="outline" size="sm">Download</Button>
            </div>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">February 2024</p>
              <p className="text-sm text-gray-500">Professional Plan</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">$49.00</span>
              <Button variant="outline" size="sm">Download</Button>
            </div>
          </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
} 