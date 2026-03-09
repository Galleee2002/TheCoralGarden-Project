"use client";

import { useState } from "react";
import { Menu, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { AdminSidebarNav } from "./AdminSidebarNav";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Abrir menú de navegación"
        onClick={() => setOpen(true)}
        className="text-sidebar-foreground hover:bg-sidebar-accent"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="bg-sidebar p-0 w-64 flex flex-col">
          <SheetHeader className="px-4 py-0">
            <div className="flex h-16 items-center gap-2">
              <Droplets className="h-5 w-5 text-text-secondary" />
              <SheetTitle className="font-bold text-sidebar-foreground text-sm">
                Admin Panel
              </SheetTitle>
            </div>
          </SheetHeader>
          <Separator className="bg-sidebar-border" />
          <div className="flex flex-1 flex-col overflow-y-auto">
            <AdminSidebarNav onLinkClick={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
