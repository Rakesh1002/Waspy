"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CampaignDetailsDialog } from "./campaign-details-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Campaign {
  id: string;
  name: string;
  status: string;
  sent_count: number;
  open_count: number;
  response_count: number;
  error_count: number;
  created_at: string;
}

const formatDateTime = (dateString: string) => {
  // Convert UTC to local time
  const date = new Date(dateString + "Z"); // Append 'Z' to treat the date as UTC
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use local timezone
  });
};

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingCampaign, setDeletingCampaign] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/v1/whatsapp/campaigns", {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch campaigns");
      }

      const data = await response.json();
      // Sort campaigns by created_at in descending order (newest first)
      const sortedCampaigns = data.campaigns.sort(
        (a: Campaign, b: Campaign) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setCampaigns(sortedCampaigns);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/v1/whatsapp/campaigns/${campaignId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete campaign');
      }

      // Remove campaign from state
      setCampaigns(campaigns.filter(c => c.id !== campaignId));
      toast.success('Campaign deleted successfully');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete campaign');
    } finally {
      setShowDeleteDialog(false);
      setDeletingCampaign(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No campaigns found. Create your first campaign to get started.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-card rounded-lg border p-4 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-lg font-semibold flex-1">{campaign.name}</h2>
              <Badge
                variant={
                  campaign.status === "completed" ? "default" : "secondary"
                }
              >
                {campaign.status}
              </Badge>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {formatDateTime(campaign.created_at)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                <div>
                  <span className="text-sm text-muted-foreground mr-1">
                    Sent:
                  </span>
                  <span className="font-medium">{campaign.sent_count}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground mr-1">
                    Opened:
                  </span>
                  <span className="font-medium">{campaign.open_count}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground mr-1">
                    Responses:
                  </span>
                  <span className="font-medium">{campaign.response_count}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground mr-1">
                    Errors:
                  </span>
                  <span className="font-medium text-red-500">
                    {campaign.error_count}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedCampaign(campaign.id);
                    setShowDetailsDialog(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => {
                    setDeletingCampaign(campaign.id);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Details Dialog */}
      <CampaignDetailsDialog
        campaignId={selectedCampaign || ''}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign
              and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deletingCampaign && handleDelete(deletingCampaign)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
