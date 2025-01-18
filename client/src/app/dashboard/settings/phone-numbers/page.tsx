"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PhoneNumberList } from "@/components/settings/phone-number-list";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface PhoneNumber {
  id: string;
  verified_name: string;
  display_phone_number: string;
  quality_rating: string;
  code_verification_status?: string;
  whatsapp_registered: boolean;
}


export default function PhoneNumbersPage() {
  const [loading, setLoading] = useState(true);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [syncing, setSyncing] = useState(false);

  const fetchPhoneNumbers = async () => {
    try {
      const response = await fetch("/api/v1/whatsapp/phone-numbers");
      if (!response.ok) {
        throw new Error("Failed to fetch phone numbers");
      }
      const data = await response.json();
      console.log("API Response:", data); // Debug log

      // Ensure we have an array of phone numbers
      const numbers = Array.isArray(data) ? data : data.phone_numbers || [];

      // For each phone number, check registration status
      const numbersWithStatus = await Promise.all(
        numbers.map(async (number: PhoneNumber) => {
          try {
            const statusResponse = await fetch(
              `/api/v1/whatsapp/verify-registration?phone_number_id=${number.id}`
            );
            number.whatsapp_registered = statusResponse.ok;
          } catch (error) {
            console.error("[VERIFY_REGISTRATION]", error);
            number.whatsapp_registered = false;
          }
          return number;
        })
      );

      setPhoneNumbers(numbersWithStatus);
    } catch (error) {
      console.error("[PHONE_NUMBERS_FETCH]", error);
      toast.error("Failed to fetch phone numbers");
      setPhoneNumbers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetchPhoneNumbers();
      toast.success("Phone numbers synced successfully");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
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
                <BreadcrumbPage>Phone Numbers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl space-y-4 p-4 lg:p-8 lg:pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Phone Numbers</h2>
            <Button variant="outline" onClick={handleSync} disabled={syncing}>
              {syncing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Numbers
                </>
              )}
            </Button>
          </div>
        </div>
      
      
        <div className="mx-auto max-w-6xl space-y-4 p-4 lg:p-8 lg:pt-6">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <PhoneNumberList
            phoneNumbers={phoneNumbers}
            onUpdate={fetchPhoneNumbers}
          />
        )}
      </div>
      </main>
    </div>
  );
}
