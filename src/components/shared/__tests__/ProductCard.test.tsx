import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "../ProductCard";

const baseProps = {
  id: "prod-1",
  name: "Filtro de Agua",
  slug: "filtro-de-agua",
  price: 5000,
  stock: 10,
};

describe("ProductCard", () => {
  it("renders the product name", () => {
    render(<ProductCard {...baseProps} />);
    expect(screen.getByText("Filtro de Agua")).toBeInTheDocument();
  });

  it("renders a formatted ARS price", () => {
    render(<ProductCard {...baseProps} />);
    // Intl.NumberFormat formats 5000 ARS — match the numeric part
    expect(screen.getByText(/5\.000/)).toBeInTheDocument();
  });

  it("renders the 'Ver más' CTA button", () => {
    render(<ProductCard {...baseProps} />);
    expect(screen.getByText(/ver más/i)).toBeInTheDocument();
  });

  it("links to the correct product URL", () => {
    render(<ProductCard {...baseProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/productos/filtro-de-agua");
  });

  it("shows PackageSearch icon when no image is provided", () => {
    const { container } = render(<ProductCard {...baseProps} />);
    // No <img> should be rendered
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders an img element when image is provided", () => {
    render(
      <ProductCard {...baseProps} image="https://example.com/img.jpg" />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Filtro de Agua");
  });

  it("transforms Cloudinary images for the product catalog", () => {
    render(
      <ProductCard
        {...baseProps}
        image="https://res.cloudinary.com/demo/image/upload/v123/product.jpg"
      />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute(
      "src",
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,h_600,c_pad,b_rgb:F8F8F8/v123/product.jpg"
    );
  });

  it("shows 'Sin stock' badge when stock is 0", () => {
    render(<ProductCard {...baseProps} stock={0} />);
    expect(screen.getByText("Sin stock")).toBeInTheDocument();
  });

  it("does not show 'Sin stock' badge when stock > 0", () => {
    render(<ProductCard {...baseProps} stock={5} />);
    expect(screen.queryByText("Sin stock")).not.toBeInTheDocument();
  });

  it("shows description when provided", () => {
    render(
      <ProductCard {...baseProps} description="Filtro de alta calidad para acuarios." />
    );
    expect(
      screen.getByText("Filtro de alta calidad para acuarios.")
    ).toBeInTheDocument();
  });

  it("does not show description when omitted", () => {
    render(<ProductCard {...baseProps} />);
    expect(
      screen.queryByText("Filtro de alta calidad para acuarios.")
    ).not.toBeInTheDocument();
  });
});
