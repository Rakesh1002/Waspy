"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
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
import { Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { countryCodes } from "@/lib/country-codes";

interface TemplateParameter {
  type: string;
  format: string;
  text: string;
  example: {
    text: string;
    [key: string]: unknown;
  } | null;
}

interface TemplateComponent {
  type: string;
  parameters: Array<{
    type: string;
    text: string;
  }>;
}

interface Template {
  name: string;
  description: string;
  parameters: TemplateParameter[];
  requiresMessage: boolean;
  language: string;
  components: TemplateComponent[] | null;
  variables_count: number;
  category: string;
}

interface Templates {
  [key: string]: Template;
}

export function MessageForm() {
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [templates, setTemplates] = useState<Templates>({});
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    const savedCountryCode = localStorage.getItem("lastCountryCode");
    if (savedCountryCode) {
      setCountryCode(savedCountryCode);
    } else {
      setCountryCode("+91"); // Default to India, with plus sign
    }
  }, []);

  useEffect(() => {
    if (countryCode) {
      localStorage.setItem("lastCountryCode", countryCode);
    }
  }, [countryCode]);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch("/api/v1/whatsapp/templates");
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
  }, []);

  const currentTemplate = selectedTemplate ? templates[selectedTemplate] : null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
      const fullPhoneNumber = countryCode + cleanPhoneNumber;

      if (!cleanPhoneNumber || cleanPhoneNumber.length !== 10) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }

      if (!selectedTemplate) {
        toast.error("Please select a template");
        return;
      }

      const template = templates[selectedTemplate];
      const variables = message.split(";").map((v) => v.trim());

      // Validate number of parameters
      if (template.variables_count > 0) {
        if (!message.trim()) {
          toast.error(
            `This template requires ${template.variables_count} parameter(s)`
          );
          return;
        }

        if (variables.length !== template.variables_count) {
          toast.error(
            `This template requires exactly ${template.variables_count} parameter(s). You provided ${variables.length}.`
          );
          return;
        }
      }

      // Build template components based on parameters
      const components = template.parameters.map((param, index) => ({
        type: param.type.toUpperCase(),
        parameters: [
          {
            type: "text",
            text: variables[index] || "",
          },
        ],
      }));

      const response = await fetch("/api/v1/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: fullPhoneNumber,
          use_template: true,
          template_name: selectedTemplate,
          template: {
            name: selectedTemplate,
            language: { code: template.language },
            components,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "An unexpected error occurred";

        // Check for specific error types
        if (
          errorMessage.includes("Template") &&
          errorMessage.includes("not found")
        ) {
          toast.error("Template Error", {
            description:
              "The selected template is not available. Please check the template name and language.",
          });
        } else if (errorMessage.includes("WhatsApp API error")) {
          toast.error("WhatsApp API Error", {
            description:
              errorMessage.split("WhatsApp API error:")[1]?.trim() ||
              errorMessage,
          });
        } else {
          toast.error("Failed to send message", {
            description: errorMessage,
          });
        }
        return;
      }

      toast.success("Message sent successfully!");

      // Reset form
      setPhoneNumber("");
      setMessage("");
      setSelectedTemplate(Object.keys(templates)[0]);
    } catch (error) {
      console.error("[WHATSAPP_SEND]", error);
      toast.error("Failed to send message", {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingTemplates) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <div className="w-32">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger>
              <SelectValue placeholder="Code" />
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((country) => (
                <SelectItem key={country.code} value={`+${country.code}`}>
                  <div className="flex flex-col">
                    <span className="font-medium">+{country.code}</span>
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
              // Allow only numbers and limit length
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                // Adjust max length as needed
                setPhoneNumber(value);
              }
            }}
            pattern="[0-9]{10}" // Enforce 10 digits
            title="Please enter a valid 10-digit mobile number"
            required
            minLength={10}
            maxLength={10}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(templates).map(([key, template]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <span>{template.name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80 p-2">
                          <p className="font-medium mb-1">Template Details:</p>
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
                            {template.parameters.map((param, index) => (
                              <div key={index} className="text-sm">
                                <p className="text-muted-foreground">
                                  {param.type}:
                                </p>
                                <p className="font-mono text-xs bg-secondary p-1 rounded mt-1">
                                  {param.text}
                                </p>
                                {param.example && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Example: {JSON.stringify(param.example)}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {currentTemplate?.requiresMessage && (
        <div className="space-y-2">
          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="font-medium mb-2">Template Structure:</p>
            {currentTemplate.parameters.map((param, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground capitalize font-medium">
                    {param.type}:
                  </p>
                  {param.type.toLowerCase() === "header" && (
                    <p className="text-xs text-yellow-600">
                      (max 60 characters)
                    </p>
                  )}
                </div>
                <p className="font-mono bg-background p-2 rounded mt-1 text-sm">
                  {param.text}
                </p>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t">
              <p className="font-medium mb-2">Required Variables:</p>
              {currentTemplate.parameters.map((param, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono bg-secondary px-1 rounded">
                    Variable {index + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Goes into {param.type.toLowerCase()} section
                  </span>
                  {param.example && (
                    <span className="text-xs text-muted-foreground">
                      (Example: {param.example.text})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Textarea
            placeholder={`Enter values in order: ${currentTemplate.parameters
              .map((param, i) => `${i + 1}. ${param.type.toLowerCase()}`)
              .join("; ")}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required={currentTemplate.requiresMessage}
            rows={4}
          />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              Example:{" "}
              {currentTemplate.parameters
                .map((param) => param.example?.text || `[${param.type} value]`)
                .join(" ; ")}
            </p>
            <p className="text-yellow-600">
              Note: Enter values in order, separated by semicolons (;). Header
              text cannot exceed 60 characters.
            </p>
          </div>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send Message
      </Button>
    </form>
  );
}
