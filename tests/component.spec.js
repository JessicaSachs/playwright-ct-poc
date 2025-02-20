// Writing this test in node and then bridging to the browser
// solely for mounting purposes
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Counter component", () => {
  test("mounts with dynamic import pattern", async ({ page }) => {
    await page.evaluate(async () => {
      const { Counter } = await import("./src/counter.js");
      mount(Counter({ initialCount: 5 }));
    });

    await expect(page.locator(".count")).toHaveText("5");
    await page.locator(".increment").click();
    await expect(page.locator(".count")).toHaveText("6");
  });

  test("can mount multiple times with different props", async ({ page }) => {
    // Mount first counter
    await page.evaluate(async () => {
      const { Counter } = await import("./src/counter.js")
      mount(Counter({ initialCount: 0 }));
    });

    await expect(page.locator(".count")).toHaveText("0");

    // Remount with different initial count
    await page.evaluate(async () => {
      const { Counter } = await import("./src/counter.js")
      mount(Counter({ initialCount: 10 }));
    });

    await expect(page.locator(".count")).toHaveText("10");
  });
});
