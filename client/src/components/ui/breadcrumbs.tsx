"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  title: string;
  link: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.link} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
            )}
            <Link
              href={item.link}
              className={
                index === items.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
} 