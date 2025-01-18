"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Circle, MessageSquare } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface CampaignDetailsProps {
  campaignId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TemplateContent {
  name: string;
  language: string;
  status: string;
  category: string;
  components: Array<{
    type: string;
    text?: string;
    format?: string;
    example?: {
      body_text?: string[][];
    };
    buttons?: Array<{
      type: string;
      text: string;
      url?: string;
    }>;
  }>;
}

interface CampaignDetails {
  id: string;
  name: string;
  status: string;
  template_name: string;
  template_content: {
    raw: Record<string, unknown>;
    final_message: string;
  };
  recipients: string[];
  metrics: {
    sent: number;
    delivered: number;
    read: number;
    clicked: {
      type: string;
      button_content: string;
      count: number;
    }[];
    status: string;
    last_status_update: string | null;
  };
  created_at: string;
  completed_at: string | null;
  error_count: number;
}

export function CampaignDetailsDialog({
  campaignId,
  open,
  onOpenChange,
}: CampaignDetailsProps) {
  const [details, setDetails] = useState<CampaignDetails | null>(null);
  const [templateContent, setTemplateContent] =
    useState<TemplateContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaignDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/v1/campaigns/${campaignId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch campaign details");
      }

      const data = await response.json();
      setDetails(data);

      if (data.template_name) {
        await fetchTemplateContent(data.template_name);
      }
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      setError("Failed to load campaign details");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (open && campaignId) {
      fetchCampaignDetails();
    }
  }, [campaignId, open, fetchCampaignDetails]);

  const fetchTemplateContent = async (templateName: string) => {
    try {
      const response = await fetch(
        `/api/v1/whatsapp/template-content?phone_number_id=602154019636453&template_name=${templateName}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch template content");
      }

      const data = await response.json();

      // Transform the data to match our TemplateContent interface
      const transformedData: TemplateContent = {
        name: data.name,
        language: data.language,
        status: data.status,
        category: data.category || "UTILITY",
        components: [],
      };

      // Map the raw components from the API
      if (data.content) {
        if (data.content.header) {
          transformedData.components.push({
            type: "HEADER",
            text: data.content.header.text,
            format: data.content.header.format,
          });
        }

        if (data.content.body) {
          transformedData.components.push({
            type: "BODY",
            text: data.content.body,
            example: {
              body_text: [Object.values(data.template_content.raw || {})],
            },
          });
        }

        if (data.content.buttons) {
          transformedData.components.push({
            type: "BUTTONS",
            buttons: data.content.buttons,
          });
        }
      }

      console.log("Transformed template content:", transformedData);
      setTemplateContent(transformedData);
    } catch (error) {
      console.error("Error fetching template content:", error);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "read":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "sent":
        return <Circle className="h-4 w-4 text-gray-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-300" />;
    }
  };

  const renderTemplateContent = () => {
    if (!templateContent) {
      console.log("No template content available");
      return null;
    }

    console.log("Rendering template content:", templateContent);

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Template Structure</h3>
            <Badge variant="outline">{templateContent.category}</Badge>
          </div>
        </div>

        <div className="space-y-4">
          {templateContent.components.map((component, index) => {
            console.log("Rendering component:", component);
            switch (component.type.toUpperCase()) {
              case "HEADER":
                return (
                  <div key={index} className="space-y-1">
                    <h4 className="text-sm font-medium">Header</h4>
                    <div className="bg-muted p-2 rounded">
                      {component.format === "TEXT"
                        ? component.text
                        : `[${component.format}]`}
                    </div>
                  </div>
                );
              case "BODY":
                return (
                  <div key={index} className="space-y-1">
                    <h4 className="text-sm font-medium">Body</h4>
                    <div className="bg-muted p-2 rounded whitespace-pre-wrap">
                      {component.text}
                    </div>
                    {component.example?.body_text && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Example values:{" "}
                        {component.example.body_text[0].join(", ")}
                      </div>
                    )}
                  </div>
                );
              case "BUTTONS":
                return (
                  <div key={index} className="space-y-2">
                    <h4 className="text-sm font-medium">Buttons</h4>
                    <div className="space-y-1">
                      {component.buttons?.map((button, buttonIndex) => (
                        <div
                          key={buttonIndex}
                          className="bg-muted p-2 rounded flex justify-between"
                        >
                          <span>{button.text}</span>
                          <span className="text-muted-foreground text-sm">
                            {button.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>

        {details?.template_content.final_message && (
          <div className="space-y-2 mt-6 pt-6 border-t">
            <h3 className="font-medium">Sent Message</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="text-sm font-medium">Variables Used:</div>
              {details.template_content.raw && (
                <div className="text-sm text-muted-foreground">
                  {Object.entries(details.template_content.raw).map(
                    ([key, value]) => (
                      <div key={key}>
                        {key}: {String(value)}
                      </div>
                    )
                  )}
                </div>
              )}
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm font-medium mb-2">Final Message:</div>
                <pre className="whitespace-pre-wrap text-sm">
                  {details.template_content.final_message}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Campaign Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">{error}</div>
        ) : details ? (
          <Tabs defaultValue="overview" className="h-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="recipients">Recipients</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[60vh] mt-4">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{details.name}</h3>
                    <Badge
                      variant={
                        details.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {details.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Created: {formatDateTime(details.created_at)}
                    {details.completed_at && (
                      <div>
                        Completed: {formatDateTime(details.completed_at)}
                      </div>
                    )}
                  </div>
                  {renderTemplateContent()}
                </div>
              </TabsContent>

              <TabsContent value="recipients" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">
                    Recipients ({details.recipients.length})
                  </h3>
                  <div className="space-y-2">
                    {details.recipients.map((recipient, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{recipient}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-1">Sent</h3>
                      <p className="text-2xl">{details.metrics.sent}</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-1">Delivered</h3>
                      <p className="text-2xl">{details.metrics.delivered}</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-1">Read</h3>
                      <p className="text-2xl">{details.metrics.read}</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-1">Errors</h3>
                      <p className="text-2xl text-red-500">
                        {details.error_count}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Message Status</h3>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      {getStatusIcon(details.metrics.status)}
                      <span className="capitalize">
                        {details.metrics.status}
                      </span>
                      {details.metrics.last_status_update && (
                        <span className="text-sm text-muted-foreground ml-auto">
                          Updated:{" "}
                          {formatDateTime(details.metrics.last_status_update)}
                        </span>
                      )}
                    </div>
                  </div>

                  {details.metrics.clicked.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Button Interactions</h3>
                      {details.metrics.clicked.map((click, index) => (
                        <div
                          key={index}
                          className="flex justify-between p-2 bg-muted rounded-lg"
                        >
                          <span>{click.button_content}</span>
                          <span className="font-medium">
                            {click.count} clicks
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            Campaign details not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
