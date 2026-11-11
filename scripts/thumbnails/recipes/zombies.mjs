// Zombies: startskärmen och spelvyn för en människa mitt i en match.
// Ingen verifierad publik adress finns, så bilden tas från en lokal körning av repot.
// Appen kräver en databas för riktiga matcher. Här skapas ingen match och ingen databas
// används: spelvyn ritas mot ett påhittat speltillstånd som Playwright svarar med i den egna
// webbläsaren. Spelarnamn, positioner och spelområde (Karlstad centrum) är syntetiska.
const C = { lat: 59.3793, lng: 13.5036 };
const GID = "demo1";
const FAKE_DB = "postgresql://user:pass@localhost:5432/none";

export default {
  slug: "zombies",
  name: "Zombies",
  device: "mobile",
  url: "http://localhost:4330/",
  context: { permissions: ["geolocation"], geolocation: { latitude: C.lat, longitude: C.lng, accuracy: 6 } },
  async prepare(page, shoot) {
    await page.getByText(/host game/i).first().waitFor({ timeout: 20_000 });
    await page.waitForFunction(
      () => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
      null,
      { timeout: 20_000 },
    );
    await page.waitForTimeout(600);
    await shoot();

    const ctx = page.context();
    await ctx.addInitScript(([gid]) => {
      try {
        localStorage.setItem("zombies:token:" + gid, JSON.stringify({ token: "demo", participantId: "p1", displayName: "Player 1" }));
        localStorage.setItem("zombies:last-game", gid);
      } catch {}
    }, [GID]);
    const m = (dy, dx) => ({ lat: C.lat + dy / 111320, lng: C.lng + dx / (111320 * Math.cos(C.lat * Math.PI / 180)) });
    const mkState = () => {
      const now = Date.now(), gameMs = 34 * 60000;
      const pos = (id, name, role, dy, dx, self = false) => ({ participantId: id, displayName: name, role, isSelf: self, source: "LIVE", ...m(dy, dx), accuracyM: 6, recordedAt: now - 2000, ageMs: 2000, stale: false, marker: self ? "SELF" : role });
      const positions = [
        pos("p1", "Player 1", "HUMAN", 0, 0, true), pos("p2", "Player 2", "HUMAN", -90, 60), pos("p3", "Player 3", "HUMAN", 70, -120), pos("p4", "Player 4", "HUMAN", 150, 90),
        pos("z1", "Zombie 1", "ZOMBIE", 190, -70), pos("z2", "Zombie 2", "ZOMBIE", -140, -160), pos("z3", "Zombie 3", "ZOMBIE", -60, 190),
      ];
      const roster = positions.map((p) => ({ participantId: p.participantId, displayName: p.displayName, gameplayState: p.role === "HUMAN" ? "HUMAN" : "ZOMBIE", isHost: p.isSelf, isSelf: p.isSelf }));
      const poly = [m(-330, -380), m(-330, 380), m(330, 380), m(330, -380)];
      return {
        serverNow: now, gameMs, phase: "EXTRACTION_REVEALED",
        game: { id: GID, name: "Demo", status: "RUNNING", joinCode: "ACD", durationMs: 45 * 60000, revealIntervalMs: 180000, headStartMs: 120000, infectionDurationMs: 120000, captureRadiusM: 15, extractionRevealAtGameMs: 30 * 60000, extractionOpenAtGameMs: 40 * 60000, extractionWindowMs: 5 * 60000, startedAt: now - gameMs, endedAt: null },
        self: { participantId: "p1", displayName: "Player 1", isHost: true, gameplayState: "HUMAN", infectionRemainingMs: null, turnsAtGameMs: null, captureCooldownRemainingMs: 0, captureCooldownUntilGameMs: null, extractedAtGameMs: null, joinedAtGameMs: null },
        zones: [{ id: "za", gameId: GID, zoneType: "GAME_AREA", geometry: { kind: "polygon", points: poly }, label: null }],
        extraction: { ...m(240, -250), radiusM: 100 }, extractionRevealInMs: null, extractionOpenInMs: 6 * 60000, extractionCloseInMs: 11 * 60000, extractionCloseAtGameMs: 45 * 60000,
        roster, counts: { total: 7, humans: 4, infected: 0, zombies: 3, extracted: 0, failedToExtract: 0, removed: 0 }, positions, tracking: { selfFixAgeMs: 1500 }, trails: [],
        nextRevealInMs: 60000, nextRevealAtGameMs: gameMs + 60000, revealOpenUntilGameMs: gameMs + 10000, proximity: null,
        captureTargets: [], capturesAgainstSelf: [], canAdminister: true, rejoinRequests: [],
      };
    };
    await ctx.route("**/api/games/" + GID + "/state*", (r) => r.fulfill({ json: mkState() }));
    await ctx.route("**/api/games/" + GID + "/positions", (r) => r.fulfill({ json: { accepted: 1 } }));
    await page.goto("http://localhost:4330/g/" + GID, { waitUntil: "load" });
    await page.getByRole("button", { name: "OK", exact: true }).click({ timeout: 8000 }).catch(() => {}); // "Extraction point revealed"-bild
    await page.getByText("YOU ARE A HUMAN").waitFor({ timeout: 20000 }).catch(() => { throw new Error("Spelvyn renderades inte"); });
    await page.waitForFunction(() => document.querySelectorAll(".maplibregl-canvas").length > 0, null, { timeout: 20000 });
    await page.waitForTimeout(4000); // låt OSM-rutorna ladda
    if (await page.getByText("EXTRACTION POINT REVEALED").count()) throw new Error("Modal blockerar vyn");
    await shoot();
  },
  local: {
    repo: "zombies",
    install: "npm ci",
    build: "npm run build",
    start: "npm run start -- -p 4330",
    // Bygget behöver bara att adressen finns. Värdet är avsiktligt ogiltigt.
    env: { DATABASE_URL: FAKE_DB, NODE_USE_ENV_PROXY: "1" },
  },
};
