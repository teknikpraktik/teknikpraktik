// Japan for Dummies: startsidan med kursens upplägg och teman.
// Fotot på startsidan (torii-portar, Fushimi Inari) är enligt projektets bildregister CC0 1.0.
export default {
  slug: "japan-for-dummies",
  name: "Japan for Dummies",
  device: "desktop",
  url: "https://japan-for-dummies.vercel.app/",
  async prepare(page) {
    await page.getByRole("heading", { name: "Teman", exact: true }).waitFor({ timeout: 15_000 });
    await page.waitForFunction(
      () => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
      null,
      { timeout: 20_000 },
    );
    await page.mouse.move(5, 5);
    await page.waitForTimeout(500);
  },
};
