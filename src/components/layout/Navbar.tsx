"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/features/cart/store/cartStore";
import dynamic from "next/dynamic";
const CartDrawer = dynamic(
  () => import("./CartDrawer").then((m) => ({ default: m.CartDrawer })),
  { ssr: false }
);
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/productos", label: "PRODUCTOS" },
  { href: "/servicio-tecnico", label: "SERVICIO TÉCNICO" },
  { href: "/sobre-nosotros", label: "SOBRE NOSOTROS" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  const isTransparentPage = pathname === "/" || pathname === "/servicio-tecnico";
  const isTransparent = isTransparentPage && !scrolled;

  useEffect(() => {
    if (!isTransparentPage) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTransparentPage]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          isTransparent
            ? "bg-transparent"
            : "bg-bg-secondary"
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="relative h-10 w-40 shrink-0">
            <Image
              src={isTransparent ? "/LOGO.svg" : "/logo-fade.svg"}
              alt="The Coral Garden"
              fill
              className={cn(
                "object-contain transition-all",
                isTransparent ? "brightness-0 invert" : ""
              )}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-regular tracking-wider transition-colors",
                  isTransparent
                    ? "text-white/90 hover:text-white"
                    : "text-white/90 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden sm:inline-flex",
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-white hover:bg-white/10"
              )}
              aria-label="Favoritos"
            >
              <Heart className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative",
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-white hover:bg-white/10"
              )}
              onClick={() => setCartOpen(true)}
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  className={cn(
                    "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]",
                    "bg-text-secondary text-bg-secondary"
                  )}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden sm:inline-flex",
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-white hover:bg-white/10"
              )}
              asChild
            >
              <Link href="/admin" aria-label="Admin">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden",
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-white hover:bg-white/10"
              )}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div
            className={cn(
              "lg:hidden",
              "bg-bg-secondary/95 backdrop-blur"
            )}
          >
            <nav className="container mx-auto flex flex-col px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "py-3 text-sm font-bold tracking-wider transition-colors",
                    "text-white/90 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2 border-t border-white/10 pt-4">
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium",
                    "text-white/70"
                  )}
                >
                  <User className="h-4 w-4" />
                  Admin
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
