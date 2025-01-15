"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

type Campaign = {
  id: string;
  name: string;
  status: "draft" | "scheduled" | "active" | "completed";
  audience: string;
  sentCount: number;
  openRate: number;
  responseRate: number;
  scheduledDate?: string;
};

export function CampaignList() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    // Mock data - replace with API call
    {
      id: "1",
      name: "Spring Sale Announcement",
      status: "active",
      audience: "All Customers",
      sentCount: 1200,
      openRate: 68,
      responseRate: 42,
    },
    // Add more mock campaigns...
  ]);

  return (
    <div className="grid gap-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">
                {campaign.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    campaign.status === "active" ? "default" : "secondary"
                  }
                >
                  {campaign.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {campaign.audience}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-lg font-semibold">{campaign.sentCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Rate</p>
                <p className="text-lg font-semibold">{campaign.openRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-lg font-semibold">
                  {campaign.responseRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
