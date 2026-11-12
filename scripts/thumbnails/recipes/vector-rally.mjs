// Vector Rally: pågående lopp på Silverstone med tre bilar.
// Loppet byggs i sidan med spelets egen motor (engine.js) och läses in via appens
// egen "Load state from JSON". Inget skickas till någon server.
export default {
  slug: "vector-rally",
  name: "Vector Rally",
  device: "desktop",
  // Något högre än 16:10. Bilden beskärs i nederkant, där appens felsökningsfält ligger.
  viewport: { width: 1440, height: 946 },
  url: "https://vector-rally.vercel.app/",
  context: { locale: "en-GB" },
  async prepare(page) {
    const TRACK = "silverstone", PLAYERS = 3, TURNS = 22;
    await page.getByRole("button", { name: "3", exact: true }).waitFor({ timeout: 15000 });
    await page.getByRole("button", { name: "3", exact: true }).click();
    await page.locator(`[data-track="${TRACK}"]`).click();
    await page.getByRole("button", { name: "Start race" }).click();
    await page.locator("#board").waitFor({ state: "visible", timeout: 15000 });

    const json = await page.evaluate(async ({ TRACK, PLAYERS, TURNS }) => {
      const E = await import("/engine.js");
      const T = await import("/tracks.js");
      const track = T.getTrack(TRACK);
      const n = track.samples.length;
      const near = (p) => { let b = 0, bd = 1e9; track.samples.forEach((s, i) => { const d = (s.x - p[0]) ** 2 + (s.y - p[1]) ** 2; if (d < bd) { bd = d; b = i; } }); return b; };
      let st = E.createInitialState({
        trackId: TRACK, seed: 1,
        players: Array.from({ length: PLAYERS }, (_, i) => ({ name: "Spelare " + (i + 1) })),
      });
      const cap = [7, 6, 5];
      for (let k = 0; k < TURNS * PLAYERS && !E.isFinished(st); k++) {
        const pl = st.players[st.active];
        if (pl.spin > 0) { st = E.applyMove(st, E.legalMoves(st)[0]); continue; }
        const i0 = near(pl.pos);
        let best = null, bs = -1e9;
        for (const m of E.legalMoves(st)) {
          const pv = E.previewMove(st, m);
          if (pv.crashes) continue;
          const v = pv.velocity;
          if (Math.max(Math.abs(v[0]), Math.abs(v[1])) > cap[st.active]) continue;
          let d = near(pv.landing) - i0; if (d > n / 2) d -= n; if (d < -n / 2) d += n;
          // kan bilen fortfarande bromsa in på banan?
          let ok = true, p = [...pv.landing], w = [...v];
          for (let q = 0; q < 9; q++) {
            w = w.map(c => c - Math.sign(c));
            const t = [p[0] + w[0], p[1] + w[1]];
            if (!E.segmentInside(track, p, t)) { ok = false; break; }
            p = t; if (!w[0] && !w[1]) break;
          }
          if (!ok) continue;
          if (d > bs) { bs = d; best = m; }
        }
        st = E.applyMove(st, best ?? E.legalMoves(st)[0]);
      }
      return E.stateToJSON(st);
    }, { TRACK, PLAYERS, TURNS });

    await page.locator("details.tools summary").click();
    await page.locator("#state-json").fill(json);
    await page.locator("#load-state").click();
    await page.locator("#debug-note", { hasText: "Loaded" }).waitFor({ timeout: 5000 });
    await page.locator("details.tools summary").click(); // stäng debug-panelen
    // Dra banan uppåt så att bilarna hamnar mitt i bilden i stället för under tomt papper.
    await page.mouse.move(1100, 300);
    await page.mouse.down();
    await page.mouse.move(1100, 110, { steps: 12 });
    await page.mouse.up();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.mouse.move(5, 5);
    await page.waitForTimeout(500);
  },
};
