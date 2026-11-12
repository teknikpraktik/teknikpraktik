import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// axe-paketet bär egna Playwright-typer av en annan version. Körtidsobjektet är detsamma.
type AxeOptions = ConstructorParameters<typeof AxeBuilder>[0];
const axe = (page: Page) => new AxeBuilder({ page } as unknown as AxeOptions).withTags(tags);

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

for (const width of [375, 768, 1440]) {
  test(`axe: inga fynd vid ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const results = await axe(page).analyze();
    const summary = results.violations.map((v) => `${v.impact}: ${v.id} (${v.nodes.length}) ${v.help}`);
    expect(summary).toEqual([]);
  });
}

test("axe: inga fynd med aktivt filter och på 404-sidan", async ({ page }) => {
  await page.goto("/");
  await page.locator('button[data-filter="traning"]').click();
  expect((await axe(page).analyze()).violations).toEqual([]);
  await page.goto("/finns-inte");
  expect((await axe(page).analyze()).violations).toEqual([]);
});
