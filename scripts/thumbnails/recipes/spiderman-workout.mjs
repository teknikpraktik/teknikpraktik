// Spiderman Workout: startskärmen och ett pågående pass med sju avklarade varv.
// Det pågående passet är syntetiskt: en påhittad session skrivs till localStorage och
// sidan laddas om, så att appens egen återställning ritar vyn. Inget lämnar webbläsaren.
export default {
  slug: "spiderman-workout",
  name: "Spiderman Workout",
  device: "mobile",
  url: "https://spidermanwo.vercel.app/",
  context: { locale: "en-GB" },
  async prepare(page, shoot) {
    await page.getByRole("button", { name: /start workout/i }).waitFor({ timeout: 20_000 });
    await page.waitForTimeout(500);
    await shoot();

    await page.evaluate(() => {
      const now = Date.now();
      localStorage.setItem(
        "spider-workout.active-session",
        JSON.stringify({
          id: "synthetic-thumbnail-session",
          startedAt: new Date(now - 500_000).toISOString(),
          targetEndAt: new Date(now - 500_000 + 20 * 60_000).toISOString(),
          completedRounds: 7,
        }),
      );
    });
    await page.reload({ waitUntil: "load" });
    await page.getByRole("button", { name: /round complete/i }).waitFor({ timeout: 20_000 });
    await page.waitForFunction(() => /(^|\n)7\n+ROUNDS COMPLETE/i.test(document.body.innerText), null, {
      timeout: 10_000,
    });
    await page.waitForTimeout(800);
    await shoot();
  },
};
