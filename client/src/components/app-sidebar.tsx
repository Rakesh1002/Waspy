"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
      isActive: true,
    },
    {
      title: "Campaigns",
      url: "/dashboard/campaigns",
      icon: Send,
      items: [
        {
          title: "All Campaigns",
          url: "/dashboard/campaigns",
        },
        {
          title: "Create Campaign",
          url: "/dashboard/campaigns/new",
        },
      ],
    },
    {
      title: "Messages",
      url: "/dashboard/messages",
      icon: Bot,
      items: [
        {
          title: "Compose",
          url: "/dashboard/messages/compose",
        },
        {
          title: "History",
          url: "/dashboard/messages/history",
        },
      ],
    },
    {
      title: "Knowledge Base",
      url: "/dashboard/knowledge-base",
      icon: BookOpen,
      items: [
        {
          title: "Documents",
          url: "/dashboard/knowledge-base",
        },
        {
          title: "Upload",
          url: "/dashboard/knowledge-base/upload",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "Phone Numbers",
          url: "/dashboard/settings/phone-numbers",
        },
        {
          title: "Team",
          url: "/dashboard/settings/team",
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const userData = {
    name: session?.user?.name || "Guest",
    email: session?.user?.email || "",
    avatar: session?.user?.image || "",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard" className="flex items-center space-x-2">
                <Image
                  src="/logo.svg"
                  alt="WASPY"
                  width={120}
                  height={40}
                  className="dark:invert" // Inverts colors in dark mode
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
