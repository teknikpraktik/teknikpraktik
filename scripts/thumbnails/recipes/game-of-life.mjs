// Game of Life Lab: lektionsvyn "Från glider till logik", steg 5 (AND-grind),
// stegad några generationer så att gliders är på väg längs sina banor.
export default {
  slug: "game-of-life",
  name: "Game of Life Lab",
  device: "desktop",
  // Mindre vy i 16:10, så att rutnätet och gliderna blir större i bilden.
  viewport: { width: 1152, height: 720 },
  url: "https://gameoflife-sandy-tau.vercel.app/",
  async prepare(page) {
    await page.locator("#tabLogic").click({ timeout: 15_000 });
    for (let step = 1; step < 5; step += 1) await page.locator("#nextStepBtn").click();
    await page.locator("#lessonCount", { hasText: /5\s*av\s*6/i }).waitFor({ timeout: 10_000 });
    await page.getByRole("button", { name: "AND", exact: true }).click();
    for (let generation = 0; generation < 26; generation += 1) await page.locator("#stepBtn").click();
    await page.evaluate(() => {
      const controls = document.querySelector("#controls");
      window.scrollTo(0, controls.getBoundingClientRect().top + window.scrollY - 12);
    });
    await page.mouse.move(5, 5);
    await page.waitForTimeout(300);
  },
};
