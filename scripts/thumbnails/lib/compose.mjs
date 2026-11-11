// Komponerar projektbilder i ett gemensamt 16:10-format.
// All layout görs i HTML/CSS och renderas med Playwright, så att bilderna
// använder samma typsnitt och färger som webbplatsen.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const CANVAS = { width: 1600, height: 1000 };
export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const fontDir = path.join(root, "src/fonts");

const palette = {
  paper: "#f5f2ec",
  sunken: "#e7e2d7",
  ink: "#17181c",
  muted: "#5c5e66",
  rule: "#cfc9bb",
  accent: "#a83c1b",
};

let fontCssCache;

/** Typsnitten bäddas in som data-URL:er. file://-sidor får annars inte läsa in dem. */
async function fontCss() {
  if (fontCssCache) return fontCssCache;
  const faces = [
    ["Display", "newsreader-latin-wght-normal.woff2", "200 800"],
    ["Sans", "ibm-plex-sans-latin-wght-normal.woff2", "100 700"],
    ["Mono", "ibm-plex-mono-latin-400-normal.woff2", "400"],
  ];
  const css = await Promise.all(
    faces.map(async ([family, file, weight]) => {
      const data = (await readFile(path.join(fontDir, file))).toString("base64");
      return `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${data}) format("woff2");font-weight:${weight};font-display:block;}`;
    }),
  );
  fontCssCache = css.join("\n");
  return fontCssCache;
}

async function dataUrl(file) {
  return `data:image/png;base64,${(await readFile(file)).toString("base64")}`;
}

function escapeHtml(text) {
  return text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

async function render(browser, html, size = CANVAS) {
  const context = await browser.newContext({ viewport: size, deviceScaleFactor: 1 });
  try {
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images, (img) => img.decode().catch(() => {})));
    });
    return await page.screenshot({ type: "png" });
  } finally {
    await context.close();
  }
}

const base = (css, body) => `<!doctype html><html lang="sv"><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
html,body{width:100%;height:100%;overflow:hidden}
${css}
</style></head><body>${body}</body></html>`;

/**
 * Mobilappar: en till tre telefonskärmar på en lugn bakgrund.
 * Skärmarna behåller appens proportioner. Med `frame: "crop"` (förval) visas
 * skärmen större och skärs av i nederkant, vilket gör den läsbar i litet format.
 */
export async function composeMobile(browser, shots, options = {}) {
  const { backdrop = palette.sunken, frame = "crop" } = options;
  const count = Math.min(shots.length, 3);
  const images = await Promise.all(shots.slice(0, count).map(dataUrl));
  const ratio = VIEWPORTS.mobile.height / VIEWPORTS.mobile.width;

  let width;
  let tops;
  if (frame === "full") {
    width = Math.round((CANVAS.height - 120) / ratio);
    tops = Array(count).fill(60);
  } else {
    width = [0, 610, 520, 430][count];
    tops = [[], [84], [70, 150], [140, 70, 140]][count];
  }
  const height = Math.round(width * ratio);
  const bezel = Math.round(width * 0.022);
  const radius = Math.round(width * 0.105);

  const phones = images
    .map(
      (src, i) =>
        `<div class="phone" style="margin-top:${tops[i]}px"><img src="${src}" alt=""></div>`,
    )
    .join("");

  const css = `
body{background:${backdrop};display:flex;justify-content:center;align-items:flex-start;gap:${Math.round(width * 0.11)}px}
.phone{flex:none;width:${width + bezel * 2}px;height:${height + bezel * 2}px;padding:${bezel}px;background:#111216;border-radius:${radius + bezel}px;
  box-shadow:0 2px 4px rgba(23,24,28,.10),0 28px 60px -18px rgba(23,24,28,.38)}
.phone img{display:block;width:${width}px;height:${height}px;border-radius:${radius}px;background:#fff}
`;
  return render(browser, base(css, phones));
}

/** Formgiven reservbild med projektnamnet. Ska aldrig presenteras som en skärmdump. */
export async function composePlaceholder(browser, { name, label = "Bild saknas" }) {
  const css = `
${await fontCss()}
body{background:${palette.sunken};color:${palette.ink};font-family:"Sans",sans-serif;padding:96px 104px;display:flex;flex-direction:column;justify-content:space-between;
  background-image:linear-gradient(${palette.rule} 1px,transparent 1px),linear-gradient(90deg,${palette.rule} 1px,transparent 1px);background-size:100px 100px;background-position:-1px -1px}
.mark{display:flex;align-items:center;gap:20px;font-family:"Mono",monospace;font-size:26px;letter-spacing:.08em;text-transform:uppercase;color:${palette.muted}}
.mark i{display:block;width:22px;height:22px;background:${palette.accent}}
h1{font-family:"Display",serif;font-weight:420;font-size:${name.length > 16 ? 132 : 168}px;line-height:1;letter-spacing:-.02em;max-width:1300px}
.plate{align-self:flex-start;background:${palette.sunken};padding:28px 36px 30px 0}
`;
  const body = `<div class="mark"><i></i><span>${escapeHtml(label)}</span></div>
<div class="plate"><h1>${escapeHtml(name)}</h1></div>`;
  return render(browser, base(css, body));
}

/** Delningsbild (Open Graph), 1200 × 630. */
export async function composeOpenGraph(browser, { eyebrow, title, footer }) {
  const css = `
${await fontCss()}
body{background:${palette.paper};color:${palette.ink};font-family:"Sans",sans-serif;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
.row{display:flex;align-items:center;gap:18px;font-family:"Mono",monospace;font-size:24px;letter-spacing:.08em;text-transform:uppercase;color:${palette.muted}}
.row i{display:block;width:20px;height:20px;background:${palette.accent}}
h1{font-family:"Display",serif;font-weight:420;font-size:86px;line-height:1.04;letter-spacing:-.02em;max-width:1000px}
.foot{display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid ${palette.rule};padding-top:26px;font-size:27px;color:${palette.muted}}
.foot b{font-weight:500;color:${palette.ink}}
`;
  const body = `<div class="row"><i></i><span>${escapeHtml(eyebrow)}</span></div>
<h1>${escapeHtml(title)}</h1>
<div class="foot"><b>${escapeHtml(footer[0])}</b><span>${escapeHtml(footer[1])}</span></div>`;
  return render(browser, base(css, body), { width: 1200, height: 630 });
}

/** Ikon: accentfärgad kvadrat på mörk platta. Renderas i valfri storlek. */
export async function composeIcon(browser, size) {
  const css = `body{background:${palette.ink};display:grid;place-items:center}
i{display:block;width:${Math.round(size * 0.34)}px;height:${Math.round(size * 0.34)}px;background:#e2582f}`;
  return render(browser, base(css, "<i></i>"), { width: size, height: size });
}
