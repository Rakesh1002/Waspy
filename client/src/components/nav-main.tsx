"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: NavSubItem[];
  isActive?: boolean;
}

interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();
  const { open, isMobile, toggleSidebar } = useSidebar();
  const [openGroups, setOpenGroups] = React.useState<string[]>([]);

  const toggleGroup = (title: string) => {
    if (open) {
      setOpenGroups((prev) =>
        prev.includes(title)
          ? prev.filter((t) => t !== title)
          : [...prev, title]
      );
    }
  };

  const handleLinkClick = React.useCallback(() => {
    if (isMobile && open) {
      toggleSidebar();
    }
  }, [isMobile, open, toggleSidebar]);

  return (
    <div className={cn("flex flex-col gap-1 py-2")}>
      {items.map((item) => (
        <div key={item.url}>
          {item.items ? (
            <Collapsible
              open={open && openGroups.includes(item.title)}
              onOpenChange={() => toggleGroup(item.title)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full",
                    open ? "justify-between px-4" : "justify-center p-2",
                    (pathname.startsWith(item.url) || item.isActive) &&
                      "bg-muted"
                  )}
                  title={!open ? item.title : undefined}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 shrink-0" />
                    {open && <span className="truncate">{item.title}</span>}
                  </div>
                  {open && (
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200",
                        openGroups.includes(item.title) && "rotate-90"
                      )}
                    />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 px-4 py-2">
                {item.items.map((subItem) => (
                  <Button
                    key={subItem.url}
                    variant="ghost"
                    asChild
                    className={cn(
                      "w-full justify-start gap-2",
                      pathname === subItem.url && "bg-muted"
                    )}
                    onClick={handleLinkClick}
                  >
                    <Link href={subItem.url}>
                      {subItem.icon && <subItem.icon className="h-4 w-4" />}
                      <span className="truncate">{subItem.title}</span>
                    </Link>
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Button
              variant="ghost"
              asChild
              className={cn(
                "w-full",
                open ? "justify-start px-4" : "justify-center p-2",
                pathname === item.url && "bg-muted"
              )}
              title={!open ? item.title : undefined}
              onClick={handleLinkClick}
            >
              <Link href={item.url}>
                <item.icon className="h-4 w-4 shrink-0" />
                {open && <span className="ml-2 truncate">{item.title}</span>}
              </Link>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
