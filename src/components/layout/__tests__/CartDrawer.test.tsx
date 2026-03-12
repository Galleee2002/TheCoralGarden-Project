import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartDrawer } from "../CartDrawer";
import { useCartStore } from "@/features/cart/store/cartStore";

const mockItem = {
  productId: "prod-1",
  name: "Filtro de Agua",
  price: 5000,
  quantity: 2,
  image: "",
  slug: "filtro-de-agua",
};

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

// Helper: find a button that contains a specific Lucide icon class
function getButtonByIcon(iconClass: string): HTMLButtonElement | null {
  const svg = document.querySelector<SVGElement>(`svg.${iconClass}`);
  return svg?.closest<HTMLButtonElement>("button") ?? null;
}

describe("CartDrawer", () => {
  it("shows empty cart message when no items", () => {
    render(<CartDrawer open={true} onClose={vi.fn()} />);
    expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument();
  });

  it("renders item name when cart has items", () => {
    useCartStore.setState({ items: [mockItem] });
    render(<CartDrawer open={true} onClose={vi.fn()} />);
    expect(screen.getByText("Filtro de Agua")).toBeInTheDocument();
  });

  it("renders item quantity in the quantity control", () => {
    useCartStore.setState({ items: [mockItem] });
    render(<CartDrawer open={true} onClose={vi.fn()} />);
    // The quantity span sits between the - and + buttons; its text is the quantity number
    const quantitySpan = document.querySelector("span.w-8.text-center");
    expect(quantitySpan?.textContent).toBe("2");
  });

  it("calls removeItem when trash button is clicked", async () => {
    useCartStore.setState({ items: [mockItem] });
    render(<CartDrawer open={true} onClose={vi.fn()} />);
    const trashButton = getButtonByIcon("lucide-trash-2");
    expect(trashButton).toBeTruthy();
    await userEvent.click(trashButton!);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("shows subtotal calculated from items", () => {
    useCartStore.setState({ items: [mockItem] }); // 5000 × 2 = 10000
    render(<CartDrawer open={true} onClose={vi.fn()} />);
    // ARS formatter outputs something like "$ 10.000" — match the numeric part
    const subtotalEl = document.querySelector(".border-t");
    expect(subtotalEl?.textContent).toMatch(/10[.,]000/);
  });

  it("links 'Ver carrito completo' to /carrito", () => {
    useCartStore.setState({ items: [mockItem] });
    render(<CartDrawer open={true} onClose={vi.fn()} />);
    const carritoLink = screen.getByRole("link", { name: /ver carrito completo/i });
    expect(carritoLink).toHaveAttribute("href", "/carrito");
  });

  it("links 'Finalizar compra' to /checkout", () => {
    useCartStore.setState({ items: [mockItem] });
    render(<CartDrawer open={true} onClose={vi.fn()} />);
    const checkoutLink = screen.getByRole("link", { name: /finalizar compra/i });
    expect(checkoutLink).toHaveAttribute("href", "/checkout");
  });

  it("increments quantity when + button is clicked", async () => {
    useCartStore.setState({ items: [{ ...mockItem, quantity: 1 }] });
    render(<CartDrawer open={true} onClose={vi.fn()} />);
    const plusButton = getButtonByIcon("lucide-plus");
    expect(plusButton).toBeTruthy();
    await userEvent.click(plusButton!);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("decrements quantity when - button is clicked", async () => {
    useCartStore.setState({ items: [{ ...mockItem, quantity: 3 }] });
    render(<CartDrawer open={true} onClose={vi.fn()} />);
    const minusButton = getButtonByIcon("lucide-minus");
    expect(minusButton).toBeTruthy();
    await userEvent.click(minusButton!);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });
});
