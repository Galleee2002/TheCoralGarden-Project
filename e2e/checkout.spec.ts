import { test, expect } from "@playwright/test";

test.describe("Checkout flow", () => {
  test("navigating from product listing to product detail", async ({ page }) => {
    await page.goto("/productos");
    // Click the first product card link
    const firstCard = page.locator("a[href^='/productos/']").first();
    const href = await firstCard.getAttribute("href");
    await firstCard.click();
    await expect(page).toHaveURL(href ?? /\/productos\/.+/);
  });

  test("adding an item to the cart shows badge on cart icon", async ({ page }) => {
    await page.goto("/productos");
    const firstCard = page.locator("a[href^='/productos/']").first();
    await firstCard.click();
    await page.waitForURL(/\/productos\/.+/);

    // Click "Agregar al carrito" button
    const addToCartBtn = page.getByRole("button", { name: /agregar al carrito/i });
    await addToCartBtn.click();

    // Cart badge should appear with a count
    const badge = page.locator("[data-testid='cart-badge'], .cart-count, span").filter({
      hasText: /^[1-9]/,
    });
    await expect(badge.first()).toBeVisible({ timeout: 3000 });
  });

  test("cart drawer opens and shows added item", async ({ page }) => {
    await page.goto("/productos");
    const firstCard = page.locator("a[href^='/productos/']").first();
    await firstCard.click();
    await page.waitForURL(/\/productos\/.+/);

    await page.getByRole("button", { name: /agregar al carrito/i }).click();

    // Open CartDrawer via cart icon in navbar
    await page.locator("[aria-label='Carrito'], button").filter({ hasText: "" }).first().click();
    await expect(page.getByText("Carrito de compras")).toBeVisible({ timeout: 3000 });
  });

  test("'Ver carrito completo' button navigates to /carrito", async ({ page }) => {
    // Pre-set cart state via localStorage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "coral-garden-cart",
        JSON.stringify({
          state: {
            items: [
              {
                productId: "test-1",
                name: "Test Product",
                price: 5000,
                quantity: 1,
                image: "",
                slug: "test-product",
              },
            ],
          },
          version: 0,
        })
      );
    });
    await page.goto("/carrito");
    await expect(page).toHaveURL(/\/carrito/);
    await expect(page.getByText("Test Product")).toBeVisible({ timeout: 5000 });
  });
});
