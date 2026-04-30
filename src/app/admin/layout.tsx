"use client";

import { Droplets } from "lucide-react";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { AdminSidebarNav } from "@/features/admin/components/AdminSidebarNav";
import { AdminMobileNav } from "@/features/admin/components/AdminMobileNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen flex-col lg:flex-row overflow-hidden">
      {/* Mobile header */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-sidebar px-4 lg:hidden">
        <AdminMobileNav />
        <Droplets className="h-5 w-5 text-text-secondary" />
        <span className="font-bold text-sidebar-foreground text-sm">Admin Panel</span>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex overflow-y-auto">
        <div className="flex h-16 shrink-0 items-center gap-2 px-4">
          <Droplets className="h-6 w-6 text-text-secondary" />
          <span className="font-bold text-sidebar-foreground">Admin Panel</span>
        </div>
        <Separator className="bg-sidebar-border" />
        <div className="flex flex-1 flex-col">
          <AdminSidebarNav />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-h-0">
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
