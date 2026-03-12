import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import { AdminSidebarNav } from "../AdminSidebarNav";

describe("AdminSidebarNav", () => {
  it("marks Dashboard active only on exact /admin path", () => {
    vi.mocked(usePathname).mockReturnValue("/admin");
    render(<AdminSidebarNav />);
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute("aria-current", "page");
  });

  it("does not mark Dashboard active on /admin/productos", () => {
    vi.mocked(usePathname).mockReturnValue("/admin/productos");
    render(<AdminSidebarNav />);
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink).not.toHaveAttribute("aria-current", "page");
  });

  it("marks Órdenes active when pathname starts with /admin/ordenes", () => {
    vi.mocked(usePathname).mockReturnValue("/admin/ordenes");
    render(<AdminSidebarNav />);
    const ordenesLink = screen.getByRole("link", { name: /órdenes/i });
    expect(ordenesLink).toHaveAttribute("aria-current", "page");
  });

  it("marks Productos active on /admin/productos", () => {
    vi.mocked(usePathname).mockReturnValue("/admin/productos");
    render(<AdminSidebarNav />);
    const productosLink = screen.getByRole("link", { name: /productos/i });
    expect(productosLink).toHaveAttribute("aria-current", "page");
  });

  it("inactive links do not have aria-current", () => {
    vi.mocked(usePathname).mockReturnValue("/admin");
    render(<AdminSidebarNav />);
    const ordenesLink = screen.getByRole("link", { name: /órdenes/i });
    expect(ordenesLink).not.toHaveAttribute("aria-current");
  });

  it("calls onLinkClick when a nav link is clicked", async () => {
    vi.mocked(usePathname).mockReturnValue("/admin");
    const onLinkClick = vi.fn();
    render(<AdminSidebarNav onLinkClick={onLinkClick} />);
    const ordenesLink = screen.getByRole("link", { name: /órdenes/i });
    await userEvent.click(ordenesLink);
    expect(onLinkClick).toHaveBeenCalledOnce();
  });
});
