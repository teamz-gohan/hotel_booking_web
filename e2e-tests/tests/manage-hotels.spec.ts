import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173";

// Chuẩn bị trước khi thực hiện các test case
test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // Get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("teamz.gohan@gmail.com");
  await page.locator("[name=password]").fill("99886644");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Signed in successfully!")).toBeVisible();
});

test("Should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/add-hotel`);

  await page.locator("[name=name]").fill("Test Hotel");
  await page.locator("[name=city]").fill("Test City");
  await page.locator("[name=country]").fill("Test Country");
  await page.locator("[name=description]").fill("Test Description");
  await page.locator("[name=pricePerNight]").fill("100");
  await page.selectOption("select[name=starRating]", "3");
  await page.getByText("Budget").click();
  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Parking").check();
  await page.locator("[name=adultCount]").fill("2");
  await page.locator("[name=childCount]").fill("1");
  await page.setInputFiles("[name=imageFiles]", [
    path.join(__dirname, "files", "1.png"),
    path.join(__dirname, "files", "2.png"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel saved successfully!")).toBeVisible();
});

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);

  await expect(page.getByText("Test Hotel").first()).toBeVisible();
  await expect(page.getByText("Test Description")).toBeVisible();

  await expect(page.getByText("Test City, Test Country")).toBeVisible();
  await expect(page.getByText("Budget")).toBeVisible();
  await expect(page.getByText("$100 per night")).toBeVisible();
  await expect(page.getByText("2 adults, 1 child")).toBeVisible();
  await expect(page.getByText("3 stars rating")).toBeVisible();

  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector("[name=name]", { state: "attached" }); // Chờ cho trường name attached vào DOM
  await expect(page.locator("[name=name]")).toHaveValue("Test Hotel");
  await page.locator("[name=name]").fill("Test Hotel Updated");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel saved successfully!")).toBeVisible();

  await page.reload();

  await expect(page.locator("[name=name]")).toHaveValue("Test Hotel Updated");
  await page.locator("[name=name]").fill("Test Hotel");
  await page.getByRole("button", { name: "Save" }).click();
});
