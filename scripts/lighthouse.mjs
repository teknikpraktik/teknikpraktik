#!/usr/bin/env node
// Kör Lighthouse mot produktionsbygget. Starta servern först: npm run build && npm run start -- -p 3100
//   npm run lighthouse            (http://localhost:3100)
//   npm run lighthouse -- <url>
// Inställningar: Lighthouse förval. Mobil = simulerad Moto G Power, långsam 4G, 4x CPU-strypning.
// Desktop = Lighthouse desktop-förval. Tre körningar per läge, medianen redovisas.
import { mkdir, writeFile } from "node:fs/promises";
import { launch } from "chrome-launcher";
import lighthouse, { desktopConfig } from "lighthouse";
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3100/";
const runs = 3;
const categories = ["performance", "accessibility", "best-practices", "seo"];
const targets = { performance: 90, accessibility: 95, "best-practices": 95, seo: 95 };
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

await mkdir("reports", { recursive: true });
const chrome = await launch({
  chromePath: process.env.CHROME_PATH ?? chromium.executablePath(),
  chromeFlags: ["--headless=new", "--no-sandbox"],
});

let failed = false;
try {
  for (const [mode, config] of [["mobil", undefined], ["desktop", desktopConfig]]) {
    const scores = Object.fromEntries(categories.map((c) => [c, []]));
    let last;
    for (let i = 0; i < runs; i += 1) {
      const result = await lighthouse(url, { port: chrome.port, onlyCategories: categories, output: "json" }, config);
      last = result;
      for (const c of categories) scores[c].push(Math.round(result.lhr.categories[c].score * 100));
    }
    await writeFile(`reports/lighthouse-${mode}.json`, last.report);
    console.log(`\n${mode} (${url})`);
    for (const c of categories) {
      const value = median(scores[c]);
      const ok = value >= targets[c];
      if (!ok) failed = true;
      console.log(`  ${c.padEnd(15)} ${String(value).padStart(3)}  (körningar: ${scores[c].join(", ")}; mål ${targets[c]}) ${ok ? "" : "UNDER MÅL"}`);
    }
    const audits = last.lhr.audits;
    console.log(`  LCP ${audits["largest-contentful-paint"].displayValue}, CLS ${audits["cumulative-layout-shift"].displayValue}, TBT ${audits["total-blocking-time"].displayValue}`);
  }
} finally {
  await chrome.kill();
}
process.exit(failed ? 1 : 0);
