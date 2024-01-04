import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("teamz.gohan@gmail.com");
  await page.locator("[name=password]").fill("99886644");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Signed in successfully!")).toBeVisible();
});
