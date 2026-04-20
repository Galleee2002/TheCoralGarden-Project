import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckoutForm } from "../CheckoutForm";
import { useCartStore } from "@/features/cart/store/cartStore";

vi.mock("@/features/checkout/actions/createOrder", () => ({
  createOrder: vi.fn(),
}));
vi.mock("@/features/checkout/actions/createMercadoPagoPreference", () => ({
  createMercadoPagoPreference: vi.fn(),
}));
vi.mock("@/features/checkout/actions/shippingActions", () => ({
  quoteShipping: vi.fn(),
  getShippingAgencies: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const cartItemFixture = {
  productId: "prod-1",
  name: "Filtro de Agua",
  price: 5000,
  quantity: 1,
  image: "",
  slug: "filtro-de-agua",
};

beforeEach(() => {
  useCartStore.setState({ items: [cartItemFixture] });
});

async function submitForm() {
  const submitButton = screen.getByRole("button", {
    name: /pagar con mercadopago/i,
  });
  await userEvent.click(submitButton);
}

describe("CheckoutForm", () => {
  it("renders all shipping fields", () => {
    render(<CheckoutForm />);
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^calle$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/altura/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ciudad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/provincia/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/código postal/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /calcular envío/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<CheckoutForm />);
    await submitForm();
    await waitFor(
      () => {
        expect(screen.getByText(/nombre requerido/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("shows email format error when email field is empty on submit", async () => {
    render(<CheckoutForm />);
    await userEvent.type(screen.getByLabelText(/nombre completo/i), "Juan García");
    await userEvent.type(screen.getByLabelText(/teléfono/i), "1234567");
    await userEvent.type(screen.getByLabelText(/^calle$/i), "Av. Corrientes");
    await userEvent.type(screen.getByLabelText(/altura/i), "1234");
    await userEvent.type(screen.getByLabelText(/ciudad/i), "Buenos Aires");
    await userEvent.type(screen.getByLabelText(/provincia/i), "Buenos Aires");
    await userEvent.type(screen.getByLabelText(/código postal/i), "1001");
    await submitForm();
    await waitFor(
      () => {
        expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("shows empty cart state when cart is empty", () => {
    useCartStore.setState({ items: [] });
    render(<CheckoutForm />);
    expect(screen.getByText(/el carrito está vacío/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/nombre completo/i)).not.toBeInTheDocument();
  });
});
