"use client";

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
import useSWR from "swr";
import { LineChart } from "@/components/charts/line-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

interface DashboardStats {
  active_campaigns: number;
  total_messages: number;
  response_rate: number;
  open_rate: number;
  active_campaigns_change: number;
  total_messages_change: number;
  response_rate_change: number;
  open_rate_change: number;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  sent_count: number;
  open_count: number;
  response_count: number;
  created_at: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMM d, HH:mm");
};

export default function Page() {
  const { data: statsData, isLoading: statsLoading } = useSWR<{
    success: boolean;
    stats: DashboardStats;
  }>("/api/v1/whatsapp/dashboard/stats", fetcher);

  const { data: campaignsData } = useSWR<{
    success: boolean;
    campaigns: Campaign[];
  }>("/api/v1/whatsapp/campaigns", fetcher);

  // Get last 5 campaigns
  const recentCampaigns = campaignsData?.campaigns?.slice(0, 5) || [];

  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    redirect("/");
  }

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
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl space-y-4 p-4 lg:p-8 lg:pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-medium">Active Campaigns</h3>
              {statsLoading ? (
                <div className="mt-4 h-8 w-24 animate-pulse bg-muted rounded" />
              ) : statsData?.stats ? (
                <>
                  <div className="mt-4 text-3xl font-bold">
                    {statsData.stats.active_campaigns ?? 0}
                  </div>
                  <p
                    className={`text-sm ${(statsData.stats.active_campaigns_change ?? 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {(statsData.stats.active_campaigns_change ?? 0) > 0
                      ? "+"
                      : ""}
                    {statsData.stats.active_campaigns_change ?? 0}% from last
                    month
                  </p>
                </>
              ) : (
                <div className="mt-4 text-xl text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-medium">Total Campaigns</h3>
              {statsLoading ? (
                <div className="mt-4 h-8 w-24 animate-pulse bg-muted rounded" />
              ) : (
                <>
                  <div className="mt-4 text-3xl font-bold">
                    {statsData?.stats.total_messages ?? 0}
                  </div>
                  <p
                    className={`text-sm ${(statsData?.stats.total_messages_change ?? 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {(statsData?.stats.total_messages_change ?? 0) > 0
                      ? "+"
                      : ""}
                    {statsData?.stats.total_messages_change ?? 0}% from last
                    month
                  </p>
                </>
              )}
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-medium">Response Rate</h3>
              {statsLoading ? (
                <div className="mt-4 h-8 w-24 animate-pulse bg-muted rounded" />
              ) : (
                <>
                  <div className="mt-4 text-3xl font-bold">
                    {statsData?.stats.response_rate ?? 0}%
                  </div>
                  <p
                    className={`text-sm ${(statsData?.stats.response_rate_change ?? 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {(statsData?.stats.response_rate_change ?? 0) > 0
                      ? "+"
                      : ""}
                    {statsData?.stats.response_rate_change ?? 0}% from last
                    month
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Message delivery and engagement over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!campaignsData?.campaigns?.length ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No campaign data available
                  </div>
                ) : (
                  <LineChart
                    data={campaignsData.campaigns.map((c) => ({
                      name: formatDate(c.created_at),
                      "Messages Sent": c.sent_count,
                      "Messages Opened": c.open_count,
                      Responses: c.response_count,
                    }))}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your most recent campaign interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!recentCampaigns?.length ? (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    No recent campaigns
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentCampaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(campaign.created_at),
                              {
                                addSuffix: true,
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              campaign.status === "completed"
                                ? "default"
                                : campaign.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {campaign.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {campaign.sent_count} sent • {campaign.open_count}{" "}
                            opened
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
