import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Container } from "@/components/ui/container";
import { SignOutButton } from "@/components/sign-out";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Bot, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { MessageForm } from "@/components/message-form";

// Add this type for campaign stats
type DashboardStats = {
  activeBots: number;
  totalConversations: number;
  responseRate: number;
  activeUsers: number;
  campaignCount: number;
  avgResponseTime: string;
};

// Mock function - replace with actual API call
async function getDashboardStats(): Promise<DashboardStats> {
  // TODO: Implement API call to backend
  return {
    activeBots: 3,
    totalConversations: 1250,
    responseRate: 95,
    activeUsers: 842,
    campaignCount: 5,
    avgResponseTime: "0.8s",
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats();

  if (!session) {
    console.log("No session found, redirecting to sign-in");
    redirect("/sign-in");
  }

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user?.name}
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/campaigns/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
          <SignOutButton />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBots}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Campaigns</h2>
          <Link href="/campaigns">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Add campaign cards here */}
        </div>
      </div>

      <div className="mt-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Send Test Message</h2>
          <MessageForm />
        </div>
      </div>
    </Container>
  );
}
