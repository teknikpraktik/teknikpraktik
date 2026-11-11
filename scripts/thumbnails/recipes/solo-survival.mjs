// Solo Survival: banans förhandsvisning och en pågående match på riktig karta.
// Ingen verifierad publik adress finns, så bilden tas från en lokal körning av repot.
// GPS-positionen är simulerad (repots egen testpunkt i skogen vid Karlstad). I matchvyn
// flyttas tre zombier till stigar 110–200 m från spelaren med appens eget felsökningsläge,
// eftersom de annars bara syns som små prickar på spelets startavstånd.
const START = { latitude: 59.40731, longitude: 13.46753, accuracy: 6 };

export default {
  slug: "solo-survival",
  name: "Solo Survival",
  device: "mobile",
  url: "http://localhost:4320/new",
  context: { permissions: ["geolocation"], geolocation: START },
  async prepare(page, shoot) {
    const ctx = page.context();
    const fix = async (n = 3, ms = 350) => { for (let i = 0; i < n; i++) { await ctx.setGeolocation(START); await page.waitForTimeout(ms); } };
    await page.evaluate(() => { try { localStorage.setItem("outbreak.debug", "on"); } catch {} });
    await page.reload({ waitUntil: "load" });
    await fix(4, 400);
    await page.getByText("SHOW COURSE").click();
    await page.waitForSelector('[data-testid="map"][data-loaded="true"]', { timeout: 90000 }).catch(() => { throw new Error("Förhandsvisning med karta laddades inte"); });
    await page.waitForTimeout(1500);
    await fix(3, 300);
    await shoot();
    await page.getByRole("button", { name: "START GAME" }).click();
    await page.waitForURL("**/play", { timeout: 90000 });
    await fix(4, 400);
    await page.getByRole("dialog").getByRole("button", { name: "START" }).click({ timeout: 2500 }).catch(() => {});
    await page.waitForFunction(() => !!(window.__outbreak && window.__outbreak.live && window.__outbreak.live.state.zombies.length >= 3), null, { timeout: 30000 })
      .catch(() => { throw new Error("Matchen startade inte (window.__outbreak saknas)"); });
    await fix(2, 400);
    await page.evaluate(() => {
      const live = window.__outbreak.live, pos = live.filter.position;
      const hav = (a, b) => { const r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lon - a.lon) * r; const h = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) ** 2; return 2 * 6371000 * Math.asin(Math.sqrt(h)); };
      const targets = [110, 170, 200], bearings = [0.8, 2.9, -2.3];
      live.state.zombies.slice(0, 3).forEach((z, k) => {
        let best = null;
        for (const e of live.g.edges.values()) for (let d = 0; d <= e.lengthM; d += 3) {
          const f = d / e.lengthM, i = Math.min(e.geometry.length - 2, Math.floor(f * (e.geometry.length - 1))), a = e.geometry[i], c = e.geometry[i + 1], t = f * (e.geometry.length - 1) - i;
          const ll = { lat: a.lat + (c.lat - a.lat) * t, lon: a.lon + (c.lon - a.lon) * t };
          const ang = Math.atan2(ll.lon - pos.lon, ll.lat - pos.lat);
          const da = Math.abs(((ang - bearings[k] + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);
          const diff = Math.abs(hav(ll, pos) - targets[k]) + da * 60;
          if (!best || diff < best.diff) best = { e: e.id, d, diff };
        }
        z.edgeId = best.e; z.distanceAlongEdgeM = best.d; z.route = [];
      });
    });
    await page.waitForTimeout(2500);
    const txt = await page.locator("body").innerText();
    if (!/Checkpoint 1\/6/.test(txt) && !/Checkpoint \d\/\d/.test(txt)) throw new Error("Spelvyn visas inte: " + txt.slice(0, 200));
    await shoot();
  },
  local: {
    repo: "solosurvival",
    install: "npm ci",
    build: "npm run build",
    start: "npm run start -- -p 4320",
    env: { NODE_USE_ENV_PROXY: "1" },
  },
};
