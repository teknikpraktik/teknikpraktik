#!/usr/bin/env node
// Skapar favicon, appikon och delningsbild i src/app/. Kör: npm run brand
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";
import { composeIcon, composeOpenGraph } from "../thumbnails/lib/compose.mjs";

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../src/app");
const browser = await chromium.launch();

const og = await composeOpenGraph(browser, {
  eyebrow: "Per Björkman / Teknikpraktik",
  title: "Digitala verktyg för lärande, spel och vardag.",
  footer: ["teknikpraktik.se", "Tekniklärare · civilingenjör · tidigare trafikflygare"],
});
await sharp(og).png({ compressionLevel: 9, palette: true }).toFile(path.join(app, "opengraph-image.png"));
await writeFile(path.join(app, "opengraph-image.alt.txt"), "Per Björkman – digitala verktyg för lärande, spel och vardag\n");

await sharp(await composeIcon(browser, 180)).png().toFile(path.join(app, "apple-icon.png"));

// favicon.ico: en 32 px PNG i ICO-behållare.
const png = await sharp(await composeIcon(browser, 32)).ensureAlpha().png({ palette: false }).toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await writeFile(path.join(app, "favicon.ico"), Buffer.concat([header, png]));

await writeFile(
  path.join(app, "icon.svg"),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#17181c"/><rect x="10.5" y="10.5" width="11" height="11" fill="#e2582f"/></svg>\n',
);

await browser.close();
console.log("Skapade favicon.ico, icon.svg, apple-icon.png och opengraph-image.png i src/app/");
