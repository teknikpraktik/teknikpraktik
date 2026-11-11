// BBS: passets fem övningar och ett pågående set med syntetisk vikt (40 kg).
// All data hamnar i IndexedDB i den egna webbläsarkontexten.
export default {
  slug: "bbs",
  name: "BBS",
  device: "mobile",
  url: "https://bbs-gamma-smoky.vercel.app/",
  context: { locale: "en-GB" },
  async prepare(page, shoot) {
    await page.getByRole("button", { name: "Start Workout" }).click({ timeout: 15_000 });
    await page.getByRole("button", { name: /Seated Row/ }).waitFor({ timeout: 15_000 });
    await page.waitForTimeout(300);
    await shoot();

    await page.getByRole("button", { name: /Seated Row/ }).click();
    const plus = page.locator("button", { hasText: /^\+\s*2\.5/ });
    await plus.waitFor({ timeout: 15_000 });
    for (let i = 0; i < 16; i += 1) await plus.click();
    await page.getByText(/40\s*kg/).first().waitFor();
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByText("Working set").waitFor({ timeout: 30_000 });
    await page.waitForFunction(
      () => {
        const match = document.body.innerText.match(/\b(\d\d):(\d\d)\b/);
        if (!match) return false;
        const seconds = Number(match[1]) * 60 + Number(match[2]);
        return seconds <= 65 && seconds >= 50;
      },
      null,
      { timeout: 60_000, polling: 250 },
    );
    await shoot();
  },
};
