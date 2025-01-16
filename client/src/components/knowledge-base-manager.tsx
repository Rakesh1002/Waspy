"use client";

import { useState } from "react";
import { Upload, Database, FileSpreadsheet, AlertCircle } from "lucide-react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Progress } from "./ui/progress";
import { toast } from "sonner";

interface FileStatus {
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  error?: string;
}

interface DbConfig {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

export function KnowledgeBaseManager() {
  const [connectionType, setConnectionType] = useState<"file" | "database">(
    "file"
  );
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [dbConfig, setDbConfig] = useState<DbConfig>({
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    multiple: true,
    onDrop: async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach((rejection) => {
          toast.error(`File ${rejection.file.name} rejected`, {
            description: rejection.errors.map((e) => e.message).join(", "),
          });
        });
      }

      const newFiles = acceptedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        progress: 0,
        status: "uploading" as const,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          // Simulate progress updates
          const progressInterval = setInterval(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.name === file.name && f.progress < 90
                  ? { ...f, progress: f.progress + 10 }
                  : f
              )
            );
          }, 200);

          const response = await fetch("/api/v1/knowledge-base/upload", {
            method: "POST",
            body: formData,
          });

          clearInterval(progressInterval);

          if (!response.ok) {
            throw new Error(await response.text());
          }

          setFiles((prev) =>
            prev.map((f) =>
              f.name === file.name
                ? { ...f, progress: 100, status: "complete" }
                : f
            )
          );

          toast.success("File uploaded successfully", {
            description: `${file.name} has been processed and added to the knowledge base.`,
          });
        } catch (error) {
          console.error("Upload error:", error);
          setFiles((prev) =>
            prev.map((f) =>
              f.name === file.name
                ? {
                    ...f,
                    status: "error",
                    error:
                      error instanceof Error ? error.message : "Upload failed",
                  }
                : f
            )
          );

          toast.error("Upload failed", {
            description:
              error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    },
  });

  const handleDatabaseConnect = async () => {
    try {
      const response = await fetch("/api/v1/knowledge-base/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dbConfig),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success("Database connected successfully", {
        description: "Your database has been connected to the knowledge base.",
      });
    } catch (error) {
      console.error("Database connection error:", error);
      toast.error("Connection failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button
          variant={connectionType === "file" ? "default" : "outline"}
          onClick={() => setConnectionType("file")}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
        <Button
          variant={connectionType === "database" ? "default" : "outline"}
          onClick={() => setConnectionType("database")}
        >
          <Database className="mr-2 h-4 w-4" />
          Connect Database
        </Button>
      </div>

      {connectionType === "file" ? (
        <Card>
          <CardHeader>
            <CardTitle>Upload Knowledge Base Files</CardTitle>
            <CardDescription>
              Upload CSV, Excel, PDF, or Word documents to build your knowledge
              base. Files will be processed and indexed for the AI assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <input {...getInputProps()} />
              <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports CSV, Excel, PDF, and Word documents
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-6 space-y-4">
                {files.map((file) => (
                  <div key={file.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{file.name}</span>
                      <span className="text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <Progress value={file.progress} className="h-2" />
                    {file.status === "error" && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{file.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Connect to Database</CardTitle>
            <CardDescription>
              Connect to your existing database to use as a knowledge base. The
              system will index your data for the AI assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Database Type</label>
                  <Select defaultValue="postgresql">
                    <SelectTrigger>
                      <SelectValue placeholder="Select database type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="sqlserver">SQL Server</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Host</label>
                  <Input
                    placeholder="localhost"
                    value={dbConfig.host}
                    onChange={(e) =>
                      setDbConfig({ ...dbConfig, host: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Port</label>
                  <Input
                    placeholder="5433"
                    value={dbConfig.port}
                    onChange={(e) =>
                      setDbConfig({ ...dbConfig, port: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Database Name</label>
                  <Input
                    placeholder="knowledge_base"
                    value={dbConfig.database}
                    onChange={(e) =>
                      setDbConfig({ ...dbConfig, database: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    placeholder="username"
                    value={dbConfig.username}
                    onChange={(e) =>
                      setDbConfig({ ...dbConfig, username: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={dbConfig.password}
                    onChange={(e) =>
                      setDbConfig({ ...dbConfig, password: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={handleDatabaseConnect}
              >
                Connect Database
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
