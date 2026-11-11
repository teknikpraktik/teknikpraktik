// Svinstark: inställningarna inför passet och ett pågående pass (Standard 14 min, Tuff).
export default {
  slug: "svinstark",
  name: "Svinstark",
  device: "mobile",
  url: "https://svinstark.vercel.app/",
  async prepare(page, shoot) {
    const close = page.getByRole("button", { name: /stäng|×/i }).first();
    if (await close.isVisible().catch(() => false)) await close.click().catch(() => {});
    await page.getByRole("button", { name: "Standard" }).click({ timeout: 15_000 });
    await page.getByRole("button", { name: "Tuff" }).click();
    await page.waitForTimeout(300);
    await shoot();

    await page.getByRole("button", { name: "STARTA PASS" }).click();
    await page.getByText(/Övning 1 av/).waitFor({ timeout: 15_000 });
    // Låt timern gå tills ringen är ungefär två tredjedelar full.
    await page.waitForFunction(
      () => {
        const match = document.body.innerText.match(/(\d\d):(\d\d)/);
        return match && Number(match[1]) === 0 && Number(match[2]) <= 40 && Number(match[2]) >= 30;
      },
      null,
      { timeout: 40_000, polling: 250 },
    );
    await shoot();
  },
};
