import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { ProductTabPricing } from "../ProductTabPricing";

type ProductPricingValues = {
  price: number | undefined;
  stock: number | undefined;
  shippingWeightGrams: number | undefined;
  shippingHeightCm: number | undefined;
  shippingWidthCm: number | undefined;
  shippingLengthCm: number | undefined;
};

function ProductPricingForm() {
  const form = useForm<ProductPricingValues>({
    defaultValues: {
      price: 100,
      stock: 5,
      shippingWeightGrams: 500,
      shippingHeightCm: 10,
      shippingWidthCm: 20,
      shippingLengthCm: 30,
    },
  });

  return (
    <FormProvider {...form}>
      <ProductTabPricing />
      <WatchedPrice />
    </FormProvider>
  );
}

function WatchedPrice() {
  const price = useWatch<ProductPricingValues>({ name: "price" });

  return <output data-testid="price-value">{String(price)}</output>;
}

describe("ProductTabPricing", () => {
  it("keeps numeric inputs renderable when a value is cleared", async () => {
    render(<ProductPricingForm />);

    await userEvent.clear(screen.getByRole("spinbutton", { name: /precio/i }));

    expect(screen.getByRole("spinbutton", { name: /precio/i })).toHaveValue(null);
    expect(screen.getByTestId("price-value")).not.toHaveTextContent("NaN");
  });
});
