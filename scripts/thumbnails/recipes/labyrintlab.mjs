// LabyrintLab: A* färdigkörd på banan Fallgropen, steget Observera.
export default {
  slug: "labyrintlab",
  name: "LabyrintLab",
  device: "desktop",
  url: "https://labyrintlab.vercel.app/lab",
  async prepare(page) {
    await page.getByRole("button", { name: /Fallgropen/ }).click({ timeout: 15_000 });
    await page.getByRole("button", { name: "Välj algoritm →" }).click();
    await page.locator("button.algo-choice").filter({ hasText: "A*" }).first().click({ timeout: 15_000 });
    await page.getByRole("button", { name: /^Starta / }).click();
    await page.getByRole("button", { name: "Snabbkör" }).click({ timeout: 15_000 });
    await page.getByText("Kortaste väg", { exact: true }).first().waitFor({ timeout: 15_000 });
    await page.getByRole("button", { name: "Jämför →" }).waitFor({ timeout: 15_000 });
    await page.mouse.move(5, 5);
    await page.waitForTimeout(400);
  },
};
