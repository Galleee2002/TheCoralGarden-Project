import { Droplets } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AdminSidebarNav } from "@/features/admin/components/AdminSidebarNav";
import { AdminMobileNav } from "@/features/admin/components/AdminMobileNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Mobile header */}
      <header className="flex h-14 items-center gap-3 border-b bg-sidebar px-4 lg:hidden">
        <AdminMobileNav />
        <Droplets className="h-5 w-5 text-text-secondary" />
        <span className="font-bold text-sidebar-foreground text-sm">Admin Panel</span>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center gap-2 px-4">
          <Droplets className="h-6 w-6 text-text-secondary" />
          <span className="font-bold text-sidebar-foreground">Admin Panel</span>
        </div>
        <Separator className="bg-sidebar-border" />
        <div className="flex flex-1 flex-col">
          <AdminSidebarNav />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-background">
          <div className="container mx-auto p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
