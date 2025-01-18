"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Loader2, Info, Upload } from "lucide-react";
import { toast } from "sonner";
import { countryCodes } from "@/lib/country-codes";

interface TemplateParameter {
  type: string;
  text: string;
  example?: {
    text: string;
    [key: string]: unknown;
  };
}

interface Template {
  name: string;
  description: string;
  parameters: TemplateParameter[];
  requiresMessage: boolean;
  language: string;
  variables_count: number;
  category: string;
}

interface Templates {
  [key: string]: Template;
}

interface PhoneNumber {
  id: string;
  verified_name: string;
  display_phone_number: string;
  quality_rating: string;
  code_verification_status?: string;
}

interface MessageFormProps {
  onSuccess?: () => void;
}

interface TemplateContent {
  name: string;
  language: string;
  status: string;
  content: {
    header: {
      format: string;
      text: string;
    } | null;
    body: string | null;
    footer: string | null;
    buttons: Array<{
      type: string;
      text: string;
      url?: string;
    }>;
  };
}

interface TemplateVariable {
  index: number;
  value: string;
}

interface ColumnMapping {
  variableIndex: number;
  columnName: string;
}

export function MessageForm({ onSuccess }: MessageFormProps) {
  const [loading, setLoading] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bulkNumbers, setBulkNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [templates, setTemplates] = useState<Templates>({});
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [fromNumber, setFromNumber] = useState<PhoneNumber | null>(null);
  const [recipientType, setRecipientType] = useState("single"); // 'single' | 'multiple' | 'file'
  const [file, setFile] = useState<File | null>(null);
  const [templateContent, setTemplateContent] =
    useState<TemplateContent | null>(null);
  const [loadingTemplateContent, setLoadingTemplateContent] = useState(false);
  const [templateVariables, setTemplateVariables] = useState<
    TemplateVariable[]
  >([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [fileColumns, setFileColumns] = useState<string[]>([]);

  // Load pre-selected from number if available
  useEffect(() => {
    const savedNumber = localStorage.getItem("selectedFromNumber");
    if (savedNumber) {
      setFromNumber(JSON.parse(savedNumber));
    }
  }, []);

  useEffect(() => {
    const savedCountryCode = localStorage.getItem("lastCountryCode");
    if (savedCountryCode) {
      setCountryCode(savedCountryCode);
    } else {
      setCountryCode("+91");
    }
  }, []);

  useEffect(() => {
    if (countryCode) {
      localStorage.setItem("lastCountryCode", countryCode);
    }
  }, [countryCode]);

  useEffect(() => {
    async function fetchTemplates() {
      if (!fromNumber?.id) return;

      try {
        const response = await fetch(
          `/api/v1/whatsapp/templates?phone_number_id=${fromNumber.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }
        const data = await response.json();
        setTemplates(data.templates);
        if (Object.keys(data.templates).length > 0) {
          setSelectedTemplate(Object.keys(data.templates)[0]);
        }
      } catch (error) {
        console.error("[TEMPLATES_FETCH]", error);
        toast.error("Failed to load templates");
      } finally {
        setLoadingTemplates(false);
      }
    }

    fetchTemplates();
  }, [fromNumber]);

  useEffect(() => {
    async function fetchTemplateContent() {
      if (!selectedTemplate || !fromNumber?.id) {
        console.log("No template or fromNumber selected");
        return;
      }

      setLoadingTemplateContent(true);
      try {
        console.log("Fetching template content for:", selectedTemplate);
        const response = await fetch(
          `/api/v1/whatsapp/template-content?phone_number_id=${fromNumber.id}&template_name=${selectedTemplate}`,
          { credentials: "include" }
        );

        const data = await response.json();
        console.log("Raw template response:", data);

        if (!response.ok) {
          throw new Error(data.detail || "Failed to fetch template content");
        }

        // Extract the actual template content from the response
        const templateData = data.template || data;
        console.log("Processed template data:", templateData);

        setTemplateContent(templateData);

        // Extract variables from template
        if (templateData?.content?.body) {
          console.log("Found template body:", templateData.content.body);
          const matches =
            templateData.content.body.match(/\{\{(\d+)\}\}/g) || [];
          console.log("Found variables:", matches);
          const vars = matches.map((match: string) => ({
            index: parseInt(match.replace(/[{}]/g, "")),
            value: "",
          }));
          console.log("Setting template variables:", vars);
          setTemplateVariables(vars);
        }
      } catch (error) {
        console.error("[TEMPLATE_CONTENT_FETCH]", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch template content"
        );
        setTemplateContent(null);
      } finally {
        setLoadingTemplateContent(false);
      }
    }

    fetchTemplateContent();
  }, [selectedTemplate, fromNumber?.id]);

  useEffect(() => {
    console.log("templateContent updated:", templateContent);
  }, [templateContent]);

  const currentTemplate = selectedTemplate ? templates[selectedTemplate] : null;

  const getRecipientNumbers = (): string[] => {
    switch (recipientType) {
      case "single":
        return [countryCode + phoneNumber.replace(/\D/g, "")];
      case "multiple":
        return bulkNumbers
          .split("\n")
          .map((num) => num.trim())
          .filter((num) => num.length > 0)
          .map((num) =>
            num.startsWith("+") ? num : countryCode + num.replace(/\D/g, "")
          );
      case "file":
        // File processing would be handled separately
        return [];
      default:
        return [];
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        campaign_name: campaignName,
        from_number: fromNumber?.id,
        phone_number: getRecipientNumbers()[0],
        recipients: getRecipientNumbers(),
        use_template: true,
        template_name: selectedTemplate,
        template: {
          name: selectedTemplate,
          language: { code: templateContent?.language || "en_US" },
          components: templateContent?.content?.body?.includes("{{")
            ? templateVariables.map((variable) => ({
                type: "BODY",
                parameters: [
                  {
                    type: "text",
                    text: variable.value || `[Variable ${variable.index}]`,
                  },
                ],
              }))
            : [], // Empty array for templates without variables
        },
      };

      console.log("Sending message data:", payload);

      const response = await fetch("/api/v1/whatsapp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Send message response:", data); // Debug log

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to continue");
        }
        // Handle structured error response
        const errorMessage =
          typeof data.error === "object"
            ? data.error.detail || JSON.stringify(data.error)
            : data.error || "Failed to send message";
        throw new Error(errorMessage);
      }

      toast.success("Message sent successfully!");
      if (onSuccess) {
        onSuccess();
      }

      // Reset form
      setCampaignName("");
      setPhoneNumber("");
      setBulkNumbers("");
      setMessage("");
      setFile(null);
    } catch (error) {
      console.error("[SEND_MESSAGE]", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);

      // Read CSV headers
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const headers = text
          .split("\n")[0]
          .split(",")
          .map((h) => h.trim());
        setFileColumns(headers);
      };
      reader.readAsText(file);
    }
  };

  const renderVariableInputs = () => {
    if (!templateContent?.content?.body) return null;

    switch (recipientType) {
      case "single":
      case "multiple":
        return (
          <div className="space-y-4">
            <Label>Template Variables</Label>
            {templateVariables.map((variable) => (
              <div key={variable.index} className="space-y-2">
                <Label>Variable {variable.index}</Label>
                <Input
                  value={variable.value}
                  onChange={(e) => {
                    const newVars = templateVariables.map((v) =>
                      v.index === variable.index
                        ? { ...v, value: e.target.value }
                        : v
                    );
                    setTemplateVariables(newVars);
                    setMessage(newVars.map((v) => v.value).join(";"));
                  }}
                  placeholder={`Enter value for variable ${variable.index}`}
                />
              </div>
            ))}
          </div>
        );

      case "file":
        return (
          <div className="space-y-4">
            <Label>Map CSV Columns to Template Variables</Label>
            {templateVariables.map((variable) => (
              <div key={variable.index} className="space-y-2">
                <Label>Variable {variable.index}</Label>
                <Select
                  value={
                    columnMappings.find(
                      (m) => m.variableIndex === variable.index
                    )?.columnName
                  }
                  onValueChange={(value) => {
                    const newMappings = [...columnMappings];
                    const index = newMappings.findIndex(
                      (m) => m.variableIndex === variable.index
                    );
                    if (index >= 0) {
                      newMappings[index].columnName = value;
                    } else {
                      newMappings.push({
                        variableIndex: variable.index,
                        columnName: value,
                      });
                    }
                    setColumnMappings(newMappings);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileColumns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        );
    }
  };

  if (loadingTemplates) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!fromNumber) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <p className="text-muted-foreground">No sender number selected.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please select a phone number from the phone numbers page.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form Fields */}
        <div className="space-y-6">
          {/* From Number Display */}
          <div className="bg-muted/50 p-4 rounded-lg border">
            <Label className="text-sm text-muted-foreground">
              Sending From:
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-medium">
                {fromNumber.display_phone_number}
              </span>
              <Badge variant="secondary">{fromNumber.verified_name}</Badge>
            </div>
          </div>

          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              placeholder="Enter a name for your campaign"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              required
              className="bg-background"
            />
          </div>

          {/* Recipient Selection */}
          <div className="space-y-4">
            <Label>Recipients</Label>
            <Tabs
              defaultValue="single"
              value={recipientType}
              onValueChange={setRecipientType}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="single">Single</TabsTrigger>
                <TabsTrigger value="multiple">Multiple</TabsTrigger>
                <TabsTrigger value="file">File Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-32">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem
                            key={country.code}
                            value={`+${country.code}`}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                +{country.code}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {country.country}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="tel"
                      placeholder="Mobile number (without country code)"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) {
                          setPhoneNumber(value);
                        }
                      }}
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                      required={recipientType === "single"}
                      minLength={10}
                      maxLength={10}
                      className="bg-background"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="multiple">
                <Textarea
                  placeholder="Enter multiple numbers (one per line)"
                  value={bulkNumbers}
                  onChange={(e) => setBulkNumbers(e.target.value)}
                  required={recipientType === "multiple"}
                  rows={4}
                  className="bg-background resize-none"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Enter one number per line. Country code will be added
                  automatically if not provided.
                </p>
              </TabsContent>

              <TabsContent value="file">
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/50">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    required={recipientType === "file"}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">
                      {file ? file.name : "Click to upload file"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      CSV or Excel files supported
                    </span>
                  </label>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Template Selection and Parameters */}
          <div className="space-y-4">
            <Label>Message Template</Label>
            <Select
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(templates).map(
                  ([key, template]: [string, Template]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{template.name}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="w-80 p-2">
                              <p className="font-medium mb-1">
                                Template Details:
                              </p>
                              <p>Category: {template.category}</p>
                              <p>Language: {template.language}</p>
                              {template.variables_count > 0 && (
                                <p>
                                  Variables Required: {template.variables_count}
                                </p>
                              )}
                              <div className="mt-2 pt-2 border-t">
                                <p className="font-medium mb-1">
                                  Template Structure:
                                </p>
                                {template.parameters.map(
                                  (param: TemplateParameter, index: number) => (
                                    <div key={index} className="text-sm">
                                      <p className="text-muted-foreground">
                                        {param.type}:
                                      </p>
                                      <p className="font-mono text-xs bg-muted p-1 rounded mt-1">
                                        {param.text}
                                      </p>
                                      {param.example && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Example:{" "}
                                          {JSON.stringify(param.example)}
                                        </p>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {currentTemplate?.requiresMessage && (
              <div className="space-y-4">
                {/* Template Structure */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Left Column - Template Structure */}
                  <div className="space-y-4">
                    {templateContent?.content && (
                      <div className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-md text-sm border">
                          <p className="font-medium mb-3">
                            Template Structure:
                          </p>
                          {templateContent.content.header && (
                            <div className="mb-4">
                              <div className="flex items-center gap-2">
                                <p className="text-muted-foreground capitalize font-medium">
                                  Header:
                                </p>
                                <p className="text-xs text-yellow-600">
                                  (max 60 characters)
                                </p>
                              </div>
                              <p className="font-mono bg-background p-2 rounded mt-1 text-sm">
                                {templateContent.content.header.text}
                              </p>
                            </div>
                          )}
                          {templateContent.content.body && (
                            <div className="mb-4">
                              <p className="text-muted-foreground capitalize font-medium">
                                Body:
                              </p>
                              <p className="font-mono bg-background p-2 rounded mt-1 text-sm">
                                {templateContent.content.body}
                              </p>
                            </div>
                          )}
                          {templateContent.content.footer && (
                            <div className="mb-4">
                              <p className="text-muted-foreground capitalize font-medium">
                                Footer:
                              </p>
                              <p className="font-mono bg-background p-2 rounded mt-1 text-sm">
                                {templateContent.content.footer}
                              </p>
                            </div>
                          )}
                        </div>

                        {templateContent.content.body?.includes("{{") && (
                          <div className="bg-muted/50 p-4 rounded-md text-sm border">
                            <p className="font-medium mb-3">
                              Required Variables:
                            </p>
                            {templateContent.content.body
                              .match(/\{\{(\d+)\}\}/g)
                              ?.map((variable, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 mb-2 last:mb-0"
                                >
                                  <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                                    {variable.replace(/[{}]/g, "")}
                                  </span>
                                  <span className="text-sm">
                                    Goes into{" "}
                                    <span className="font-medium">body</span>
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column - Preview */}
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-md text-sm border">
                      <p className="font-medium mb-3">Message Preview:</p>
                      <div className="bg-background rounded-lg p-4 space-y-3">
                        {templateContent?.content ? (
                          <div className="max-w-[80%] ml-auto">
                            <div className="bg-[#DCF8C6] rounded-lg p-3 shadow-sm space-y-2">
                              {templateContent.content.header && (
                                <p className="text-sm font-bold break-words">
                                  {templateContent.content.header.text}
                                </p>
                              )}
                              {templateContent.content.body && (
                                <p className="text-sm break-words">
                                  {templateContent.content.body.replace(
                                    /\{\{(\d+)\}\}/g,
                                    (_: string, index: string) => {
                                      const variable = templateVariables.find(
                                        (v) => v.index === parseInt(index)
                                      );
                                      return (
                                        variable?.value || `[Variable ${index}]`
                                      );
                                    }
                                  )}
                                </p>
                              )}
                              {templateContent.content.footer && (
                                <p className="text-xs text-gray-600 mt-2 break-words">
                                  {templateContent.content.footer}
                                </p>
                              )}
                              {templateContent.content.buttons.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-black/10">
                                  {templateContent.content.buttons.map(
                                    (button, index) => (
                                      <div
                                        key={index}
                                        className="text-blue-600 text-sm cursor-pointer hover:underline"
                                      >
                                        {button.text}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-[10px] text-gray-500 text-right mt-1">
                              {new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground p-4">
                            Select a template to see preview
                          </div>
                        )}
                      </div>
                    </div>

                    <Textarea
                      placeholder={`Enter values in order: ${currentTemplate.parameters
                        .map(
                          (param: TemplateParameter, i: number) =>
                            `${i + 1}. ${param.type.toLowerCase()}`
                        )
                        .join("; ")}`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required={currentTemplate.requiresMessage}
                      rows={4}
                      className="bg-background resize-none"
                    />
                    <div className="text-xs text-muted-foreground">
                      <p className="text-yellow-600 mb-1">
                        Note: Enter values in order, separated by semicolons
                        (;).
                        {currentTemplate.parameters.some(
                          (p) => p.type.toLowerCase() === "header"
                        ) && " Header text cannot exceed 60 characters."}
                      </p>
                      <p>
                        Example:{" "}
                        {currentTemplate.parameters
                          .map(
                            (param: TemplateParameter) =>
                              param.example?.text || `[${param.type}]`
                          )
                          .join(" ; ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - WhatsApp Preview */}
        <div className="hidden lg:block">
          <div className="relative mx-auto w-[300px]">
            {/* iPhone Mockup */}
            <div className="relative mx-auto border-[14px] border-black rounded-[2.5rem] h-[600px] w-[300px] shadow-xl overflow-hidden">
              <div className="w-[148px] h-[18px] bg-black top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-10"></div>
              <div className="h-[46px] w-[3px] bg-black absolute -left-[17px] top-[124px] rounded-l-lg"></div>
              <div className="h-[46px] w-[3px] bg-black absolute -left-[17px] top-[178px] rounded-l-lg"></div>
              <div className="h-[64px] w-[3px] bg-black absolute -right-[17px] top-[142px] rounded-r-lg"></div>
              <div className="w-full h-full bg-white">
                {/* WhatsApp UI */}
                <div className="flex flex-col h-full">
                  {/* WhatsApp Header */}
                  <div className="bg-[#128C7E] text-white p-4">
                    <div className="text-sm font-medium">
                      {fromNumber?.verified_name}
                    </div>
                    <div className="text-xs opacity-80">
                      {fromNumber?.display_phone_number}
                    </div>
                  </div>

                  {/* WhatsApp Chat */}
                  <div className="flex-1 bg-[#E5DDD5] p-4 space-y-4 overflow-y-auto">
                    {loadingTemplateContent ? (
                      <div className="text-center text-muted-foreground p-4">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                        Loading template...
                      </div>
                    ) : templateContent?.content ? (
                      <div className="max-w-[80%] ml-auto">
                        <div className="bg-[#DCF8C6] rounded-lg p-3 shadow-sm space-y-2">
                          {templateContent.content.header && (
                            <p className="text-sm font-bold break-words">
                              {templateContent.content.header.text}
                            </p>
                          )}
                          {templateContent.content.body && (
                            <p className="text-sm break-words">
                              {templateContent.content.body.replace(
                                /\{\{(\d+)\}\}/g,
                                (_: string, index: string) => {
                                  const variable = templateVariables.find(
                                    (v) => v.index === parseInt(index)
                                  );
                                  return (
                                    variable?.value || `[Variable ${index}]`
                                  );
                                }
                              )}
                            </p>
                          )}
                          {templateContent.content.footer && (
                            <p className="text-xs text-gray-500">
                              {templateContent.content.footer}
                            </p>
                          )}
                          {templateContent.content.buttons.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-black/10">
                              {templateContent.content.buttons.map(
                                (button, index) => (
                                  <div
                                    key={index}
                                    className="text-blue-600 text-sm cursor-pointer hover:underline"
                                  >
                                    {button.text}
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500 text-right mt-1">
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground p-4">
                        Select a template to see preview
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Input */}
                  <div className="bg-[#F0F2F5] p-3 flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-full h-10"></div>
                    <div className="w-10 h-10 rounded-full bg-[#128C7E] flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {templateContent?.content?.body && (
        <div className="mt-4 space-y-2">
          <Label>Template Variables</Label>
          <div className="text-sm text-muted-foreground mb-2">
            Enter values separated by semicolons (;) in order:
          </div>
          <Textarea
            placeholder="Enter variable values..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="text-xs text-muted-foreground">
            {templateContent.content.body
              .match(/\{\{(\d+)\}\}/g)
              ?.map((variable, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="font-mono bg-muted px-1 rounded">
                    Variable {variable.replace(/[{}]/g, "")}
                  </span>
                  <span>→</span>
                  <span className="italic">
                    {message.split(";")[index]?.trim() || "[Not set]"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {templateContent?.content?.body &&
        templateContent?.content?.body?.includes("{{") &&
        renderVariableInputs()}

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {recipientType === "file" ? "Start Campaign" : "Send Message"}
      </Button>
    </form>
  );
}
