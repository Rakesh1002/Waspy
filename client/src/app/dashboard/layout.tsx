import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const defaultOpen = true;

  if (!session?.user) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen bg-background w-full">
        <AppSidebar />
        <div className="flex-1 ">
          <div className="mx-auto">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
