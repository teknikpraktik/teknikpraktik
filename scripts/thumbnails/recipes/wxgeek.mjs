// WXGEEK: tidslinjen för Karlstad, från observation till prognos.
// Ingen verifierad publik adress finns, så bilden tas från en lokal körning av repot.
// Appen hämtar då riktiga öppna data från SMHI och aviationweather.gov, så bilden
// varierar med tidpunkten. Platsen sätts via appens localStorage (ingen ortssökning behövs).
export default {
  slug: "wxgeek",
  name: "WXGEEK",
  device: "desktop",
  // Appen är byggd för smala skärmar. En mindre vy i 16:10 fyller bilden bättre.
  viewport: { width: 960, height: 600 },
  url: "http://localhost:4310/",
  context: {
    geolocation: { latitude: 59.3793, longitude: 13.5036 },
    permissions: ["geolocation"],
  },
  async prepare(page) {
    await page.evaluate(() => {
      localStorage.setItem(
        "wxgeek:place",
        JSON.stringify({ name: "Karlstad", detail: "Värmlands län", latitude: 59.3793, longitude: 13.5036 }),
      );
    });
    await page.reload({ waitUntil: "load" });
    await page.getByText("Karlstad", { exact: true }).first().waitFor({ timeout: 20_000 });
    await page.getByText(/NOW \d\d:\d\d/).first().waitFor({ timeout: 40_000 });
    await page.getByText(/METAR \d\d:\d\d/).first().waitFor({ timeout: 40_000 });
    await page.getByText(/CLOUDS & PRECIPITATION/i).first().waitFor({ timeout: 20_000 });
    await page.waitForTimeout(1500);
  },
  local: {
    repo: "wxgeek",
    install: "npm ci",
    build: "npm run build",
    start: "npm run start -- -p 4310",
    // Node hämtar bara via systemets proxy om detta är satt. Ofarligt utan proxy.
    env: { NODE_USE_ENV_PROXY: "1" },
  },
};
