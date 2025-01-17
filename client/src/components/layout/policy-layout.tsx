import React from "react";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import Image from "next/image";

interface PolicyLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  currentPage: string;
}

export function PolicyLayout({
  title,
  description,
  children,
  currentPage,
}: PolicyLayoutProps) {
  const policyPages = [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Security", href: "/security" },
    { name: "Compliance", href: "/compliance" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-transparent to-primary/5">
      <Container className="max-w-4xl py-24">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>{currentPage}</span>
        </div>

        {/* Header with Logo and Title */}
        <div className="flex justify-between items-start mb-16">
          {/* Title and Description */}
          <div className="text-left max-w-2xl">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              {title}
            </h1>
            <p className="text-muted-foreground text-lg mb-4">{description}</p>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Logo */}
          <Image
            src="/logo.svg"
            alt="WASPY"
            width={120}
            height={40}
            className="dark:invert"
          />
        </div>

        {/* Policy Navigation */}
        <div className="mb-12 flex items-center justify-center gap-4">
          {policyPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page.name
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {page.name}
            </Link>
          ))}
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none">{children}</div>
      </Container>
    </div>
  );
}
