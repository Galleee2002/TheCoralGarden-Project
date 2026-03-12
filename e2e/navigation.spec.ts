import { test, expect } from "@playwright/test";

test.describe("Navbar behavior", () => {
  test("navbar on / starts without bg-bg-secondary class", async ({ page }) => {
    await page.goto("/");
    const navbar = page.locator("nav, header").first();
    // At top of page, navbar should not have the solid background class
    await expect(navbar).not.toHaveClass(/bg-bg-secondary/);
  });

  test("navbar on / gets bg-bg-secondary after scrolling 50px", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollBy(0, 100));
    const navbar = page.locator("nav, header").first();
    await expect(navbar).toHaveClass(/bg-bg-secondary/, { timeout: 3000 });
  });

  test("navbar on /productos always has bg-bg-secondary (no hero)", async ({
    page,
  }) => {
    await page.goto("/productos");
    const navbar = page.locator("nav, header").first();
    await expect(navbar).toHaveClass(/bg-bg-secondary/);
  });

  test("clicking Productos nav link goes to /productos", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Productos");
    await expect(page).toHaveURL(/\/productos/);
  });

  test("clicking Sobre Nosotros goes to /sobre-nosotros", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Sobre Nosotros");
    await expect(page).toHaveURL(/\/sobre-nosotros/);
  });
});
