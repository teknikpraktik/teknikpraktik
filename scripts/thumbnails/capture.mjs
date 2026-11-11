#!/usr/bin/env node
// Uppdaterar projektbilderna i src/assets/projects/.
//
//   npm run thumbnails                      alla projekt med publik adress
//   npm run thumbnails -- labyrintlab bbs   bara de angivna
//   npm run thumbnails -- --local-root ~/src [--build]   även projekt som fångas från lokal körning
//   npm run thumbnails -- --placeholders    skapa reservbilder där bild saknas
//
// Ett fel i ett projekt stoppar inte de övriga. Befintlig bild behålls om en ny inte kan tas.
// Se README.md, avsnittet "Uppdatera projektbilder".

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";
import { CANVAS, VIEWPORTS, composeMobile, composePlaceholder } from "./lib/compose.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const recipeDir = path.join(here, "recipes");
const outDir = path.join(root, "src/assets/projects");
const rawDir = path.join(root, ".cache/thumbnails");
const manifestPath = path.join(outDir, "manifest.json");

const args = process.argv.slice(2);
const flags = { placeholders: false, build: false, localRoot: null };
const wanted = [];
for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--placeholders") flags.placeholders = true;
  else if (arg === "--build") flags.build = true;
  else if (arg === "--local-root") flags.localRoot = path.resolve(args[(i += 1)] ?? "");
  else if (arg.startsWith("--")) {
    console.error(`Okänd flagga: ${arg}`);
    process.exit(2);
  } else wanted.push(arg);
}

const today = new Date().toISOString().slice(0, 10);

async function loadRecipes() {
  const files = (await readdir(recipeDir)).filter((f) => f.endsWith(".mjs")).sort();
  const recipes = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(path.join(recipeDir, file)).href);
    recipes.push(mod.default);
  }
  return recipes;
}

async function readManifest() {
  try {
    return JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    return {};
  }
}

async function reachable(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    return res.status < 500;
  } catch {
    return false;
  }
}

function run(command, cwd, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, { cwd, env: { ...process.env, ...env }, shell: true, stdio: "ignore" });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`"${command}" avslutades med kod ${code}`))));
    child.on("error", reject);
  });
}

/** Startar projektets lokala server om receptet behöver det. Returnerar en stoppfunktion. */
async function ensureLocal(recipe) {
  const { local } = recipe;
  if (!local) return async () => {};
  if (await reachable(recipe.url)) return async () => {};
  if (!flags.localRoot) {
    throw new SkipError(
      `fångas från lokal körning. Starta appen på ${recipe.url} eller ange --local-root <mapp med ${local.repo}/>`,
    );
  }
  const cwd = path.join(flags.localRoot, local.repo);
  if (!existsSync(cwd)) throw new SkipError(`hittar inte ${cwd}`);
  if (flags.build) {
    if (local.install) await run(local.install, cwd, local.env);
    if (local.build) await run(local.build, cwd, local.env);
  }
  const server = spawn(local.start, {
    cwd,
    env: { ...process.env, ...local.env },
    shell: true,
    stdio: "ignore",
    detached: true,
  });
  const stop = async () => {
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      /* redan avslutad */
    }
  };
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (await reachable(recipe.url)) return stop;
    await new Promise((r) => setTimeout(r, 1000));
  }
  await stop();
  throw new Error(`den lokala servern svarade inte på ${recipe.url}`);
}

class SkipError extends Error {}

/** Avvisar bilder som i praktiken är tomma (enfärgade), t.ex. en vit laddningsvy. */
async function assertNotBlank(png, label) {
  const { channels } = await sharp(png).stats();
  const spread = Math.max(...channels.slice(0, 3).map((c) => c.stdev));
  if (spread < 4) throw new Error(`${label} ser tom ut (nästan enfärgad bild)`);
}

async function capture(browser, recipe) {
  const mobile = recipe.device === "mobile";
  const context = await browser.newContext({
    viewport: mobile ? VIEWPORTS.mobile : (recipe.viewport ?? VIEWPORTS.desktop),
    deviceScaleFactor: 2,
    isMobile: mobile,
    hasTouch: mobile,
    locale: "sv-SE",
    timezoneId: "Europe/Stockholm",
    ...(recipe.context ?? {}),
  });
  try {
    const page = await context.newPage();
    const dialogs = [];
    page.on("dialog", (dialog) => {
      dialogs.push(dialog.message());
      dialog.dismiss().catch(() => {});
    });

    const shots = [];
    const shoot = async () => {
      const file = path.join(rawDir, `${recipe.slug}-${shots.length + 1}.png`);
      const png = await page.screenshot({ type: "png", animations: "disabled", caret: "hide" });
      await assertNotBlank(png, `${recipe.slug} vy ${shots.length + 1}`);
      await writeFile(file, png);
      shots.push(file);
    };

    const response = await page.goto(recipe.url, { waitUntil: "load", timeout: 60_000 });
    if (!response || response.status() >= 400) {
      throw new Error(`${recipe.url} svarade ${response?.status() ?? "inte"}`);
    }
    await recipe.prepare(page, shoot);
    if (shots.length === 0) await shoot();

    const composed = mobile
      ? await composeMobile(browser, shots, { backdrop: recipe.backdrop, frame: recipe.frame })
      : await readFile(shots[0]);

    await sharp(composed)
      .resize(CANVAS.width, CANVAS.height, { fit: "cover", position: "top" })
      .webp({ quality: 82, effort: 6 })
      .toFile(path.join(outDir, `${recipe.slug}.webp`));
  } finally {
    await context.close();
  }
}

async function placeholder(browser, recipe) {
  const png = await composePlaceholder(browser, { name: recipe.name });
  await sharp(png).webp({ quality: 88 }).toFile(path.join(outDir, `${recipe.slug}.webp`));
}

const all = await loadRecipes();
const unknown = wanted.filter((slug) => !all.some((r) => r.slug === slug));
if (unknown.length) {
  console.error(`Okända projekt: ${unknown.join(", ")}\nTillgängliga: ${all.map((r) => r.slug).join(", ")}`);
  process.exit(2);
}
const selected = wanted.length ? all.filter((r) => wanted.includes(r.slug)) : all;

await mkdir(outDir, { recursive: true });
await mkdir(rawDir, { recursive: true });
const manifest = await readManifest();
const browser = await chromium.launch();
const results = [];

for (const recipe of selected) {
  const target = path.join(outDir, `${recipe.slug}.webp`);
  const had = existsSync(target);
  let stop = async () => {};
  try {
    if (flags.placeholders) {
      if (had) {
        results.push([recipe.slug, "oförändrad", "bild finns redan"]);
        continue;
      }
      await placeholder(browser, recipe);
      manifest[recipe.slug] = { kind: "placeholder", origin: "generated", captured: today };
      results.push([recipe.slug, "reservbild", "skapad"]);
      continue;
    }
    stop = await ensureLocal(recipe);
    await capture(browser, recipe);
    manifest[recipe.slug] = {
      kind: "screenshot",
      origin: recipe.local ? "local" : "live",
      captured: today,
    };
    results.push([recipe.slug, "ny bild", recipe.url]);
  } catch (error) {
    const reason = error instanceof Error ? error.message.split("\n")[0] : String(error);
    if (had) {
      results.push([recipe.slug, error instanceof SkipError ? "hoppades över" : "FEL", `${reason} – befintlig bild behålls`]);
    } else {
      // Ingen bild alls: skapa en reservbild så att webbplatsen ändå kan byggas.
      try {
        await placeholder(browser, recipe);
        manifest[recipe.slug] = { kind: "placeholder", origin: "generated", captured: today };
        results.push([recipe.slug, "FEL → reservbild", reason]);
      } catch (inner) {
        results.push([recipe.slug, "FEL", `${reason}; reservbilden misslyckades också: ${inner}`]);
      }
    }
  } finally {
    await stop();
  }
}

await browser.close();
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`);

const pad = Math.max(...results.map(([slug]) => slug.length));
console.log("\nProjektbilder");
for (const [slug, state, detail] of results) {
  console.log(`  ${slug.padEnd(pad)}  ${state.padEnd(16)}  ${detail}`);
}
console.log(`\nRåbilder för granskning: ${path.relative(root, rawDir)}/`);
console.log("Granska alltid nya bilder visuellt innan de checkas in.\n");

process.exit(results.some(([, state]) => state.startsWith("FEL")) ? 1 : 0);
