import { test, expect } from "@playwright/test";

test.describe("Admin products — auth guard", () => {
  test("unauthenticated visit to /admin/productos redirects to /admin/login", async ({
    page,
  }) => {
    await page.goto("/admin/productos");
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 });
  });

  test("unauthenticated visit to /admin redirects to /admin/login", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 });
  });

  test("login page renders email and password fields", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
  });
});
