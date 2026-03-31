"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/ordenes", label: "Órdenes", icon: ShoppingBag },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tag },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

interface AdminSidebarNavProps {
  onLinkClick?: () => void;
}

export function AdminSidebarNav({ onLinkClick }: AdminSidebarNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {adminLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              aria-current={active ? "page" : undefined}
              className={[
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "border-l-2 border-text-secondary bg-sidebar-accent text-sidebar-foreground font-medium"
                  : "border-l-2 border-transparent text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              ].join(" ")}
            >
              <link.icon
                className={[
                  "h-4 w-4 shrink-0",
                  active ? "text-text-secondary" : "text-sidebar-foreground/50",
                ].join(" ")}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground"
          asChild
        >
          <Link href="/" target="_blank" onClick={onLinkClick}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver sitio
          </Link>
        </Button>
        <Separator className="my-1 bg-sidebar-border" />
        <form action="/api/auth/logout" method="POST">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </form>
      </div>
    </>
  );
}
