// Japan for Dummies: startsidan med kursens upplägg och teman.
// Startsidan slumpar sitt foto. Alla foton är inte fria att återge utan angivande, så receptet
// laddar om tills fotot är ett som projektets bildregister (src/content/images.json) anger som
// CC0 1.0. I första hand väljs torii-portarna vid Fushimi Inari, så att bilden blir densamma.
const PREFERRED = "fushimi-inari-stig";
const CC0 = new Set([
  "atervinningskarl-matvarubutik",
  "bishamondo-hostlov",
  "fuji-solnedgang-2025",
  "fushimi-inari-helgedomshall",
  "fushimi-inari-stig",
  "fushimi-inari-torii",
  "ganryu-inari-skylt",
  "genbaku-kupolen",
  "hankyu-utgang-takatsuki",
  "hirado-danchi",
  "hiroshige-narumi",
  "hiroshige-nihonbashi",
  "hogsta-domstolen",
  "hokusai-vagen",
  "hortensia-regnperiod",
  "kadoma-danchi",
  "kamakura-daibutsu",
  "kenroku-en-lykta",
  "klassrum-hogstadium",
  "koban-sendai",
  "matsuya-teishoku",
  "nanjing-minnesmarke",
  "risfalt-natori",
  "sakai-stadsbild",
  "sakurajima-utsikt",
  "sapporo-perrong",
  "shinjuku-parktower",
  "spelhall-mikado",
  "teishoku-udon",
  "todaiji-buddhahallen",
  "tokyo-flygbild-bostader",
  "tokyo-panorama-minato",
  "tomioka-ostra-kokonglagret",
  "toyota-motomachi",
  "tsunamiskylt-kamakura",
  "ueno-fiskstand",
  "upopoy-ainuhus",
  "yakushima-anbo",
  "yamabare-strand",
  "yoshinoya-teishoku"
]);

export default {
  slug: "japan-for-dummies",
  name: "Japan for Dummies",
  device: "desktop",
  url: "https://japan-for-dummies.vercel.app/",
  async prepare(page) {
    let chosen = null;
    for (let attempt = 0; attempt < 90; attempt += 1) {
      const hero = page.locator("#start-hero[data-ready]");
      await hero.waitFor({ timeout: 15_000 });
      const id = await hero.getAttribute("data-start-image");
      if (id === PREFERRED || (attempt >= 45 && CC0.has(id))) {
        chosen = id;
        break;
      }
      await page.reload({ waitUntil: "load" });
    }
    if (!chosen) throw new Error("startsidan visade inget foto med CC0-licens");
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
