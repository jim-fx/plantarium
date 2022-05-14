import { test, expect } from '@playwright/test';

test('successfully loads', async ({ page }) => {
  await page.goto("/");
});


test("compute", async ({ page }) => {

  // Load "/"
  await page.goto('/');

  // Fill "20" on <input> #node-view-0-2 .svelte-jold4n:nth-child(3)
  await page.fill('#node-view-0-2 input', '20');

  // Fill "10" on <input> #node-view-0-3 .svelte-jold4n:nth-child(3)
  await page.fill('#node-view-0-3 input', '10');

  await page.waitForTimeout(50)

  expect(await page.locator("#node-view-0-0 p:nth-child(4)").textContent()).toContain("200")

});

test("add node", async ({ page }) => {

  // Load "/"
  await page.goto('/');

  // Press Shift+A
  await page.keyboard.press('Shift+A');

  // Fill "boolean" on <input> [placeholder="Search"]
  await page.fill('[placeholder="Search"]', 'boolean');

  // Press Enter on input
  await page.press('[placeholder="Search"]', 'Enter');

  expect(page.locator(".node-type-boolean")).toBeTruthy()

});

test("is in window", async ({page}) => {

  await page.goto("/")

  const windowHandle = await page.evaluateHandle(() => window["system"]);

  expect(windowHandle).toBeTruthy()
})
