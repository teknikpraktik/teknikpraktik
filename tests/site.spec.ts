import { expect, test } from "@playwright/test";
import { categories, featuredProjects, projects } from "../src/data/test-data";

const widths = [375, 768, 1440] as const;

test.describe("innehåll", () => {
  test("alla projekt har ett kort med namn, beskrivning, bild och kategori", async ({ page }) => {
    await page.goto("/");
    const cards = page.getByTestId("project-card");
    await expect(cards).toHaveCount(projects.length);

    for (const project of projects) {
      const card = page.locator(`[data-testid="project-card"][data-slug="${project.slug}"]`);
      await expect(card.getByRole("heading", { level: 3 })).toHaveText(project.name);
      await expect(card).toContainText(project.description);
      await expect(card.getByRole("list", { name: "Kategorier" }).getByRole("listitem")).toHaveCount(
        project.categories.length,
      );
      const image = card.locator("img");
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty("complete", true);
      expect(await image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
      await expect(image).toHaveAttribute("width", /\d+/);
      await expect(image).toHaveAttribute("height", /\d+/);
    }
  });

  test("demolänk visas bara för projekt med verifierad adress, källkod bara för publika repon", async ({ page }) => {
    await page.goto("/");
    for (const project of projects) {
      const card = page.locator(`[data-testid="project-card"][data-slug="${project.slug}"]`);
      const demo = card.getByTestId("project-link");
      const source = card.getByTestId("source-link");
      if (project.url) {
        await expect(demo).toHaveAttribute("href", project.url);
        await expect(demo).toHaveAccessibleName(`Öppna ${project.name} ↗`.replace(" ↗", ""));
        await expect(card).toContainText("Publicerad");
      } else {
        await expect(demo).toHaveCount(0);
        await expect(card).toContainText("Ingen publik demo");
        expect(project.status).toBe("no-demo");
      }
      if (project.sourceUrl) await expect(source).toHaveAttribute("href", project.sourceUrl);
      else await expect(source).toHaveCount(0);
    }
  });

  test("tre utvalda projekt visas", async ({ page }) => {
    await page.goto("/");
    const featured = page.getByTestId("featured-project");
    await expect(featured).toHaveCount(3);
    expect(featuredProjects).toHaveLength(3);
    for (const [index, project] of featuredProjects.entries()) {
      await expect(featured.nth(index).getByRole("heading", { level: 3 })).toHaveText(project.name);
    }
  });

  test("sidan har en h1, presentation och kontaktväg", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("digitala verktyg");
    await expect(page.getByRole("heading", { name: "Om Per" })).toBeVisible();
    await expect(page.getByTestId("contact-link")).toHaveAttribute("href", "https://github.com/teknikpraktik");
  });
});

test.describe("filter", () => {
  test("varje kategori visar rätt projekt och Alla återställer", async ({ page }) => {
    await page.goto("/");
    const cards = page.getByTestId("project-card");
    const status = page.getByTestId("filter-status");

    for (const category of categories) {
      const expected = projects.filter((p) => p.categories.includes(category.id));
      const button = page.locator(`button[data-filter="${category.id}"]`);
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(cards).toHaveCount(expected.length);
      await expect(status).toHaveText(`Visar ${expected.length} av ${projects.length} projekt`);
      const shown = await cards.evaluateAll((els) => els.map((el) => el.getAttribute("data-slug")));
      expect(shown).toEqual(expected.map((p) => p.slug));
    }

    await page.locator('button[data-filter="alla"]').click();
    await expect(cards).toHaveCount(projects.length);
    await expect(page.locator('button[aria-pressed="true"]')).toHaveCount(1);
  });

  test("filtren går att använda med tangentbord", async ({ page }) => {
    await page.goto("/");
    const spel = page.locator('button[data-filter="spel"]');
    await spel.focus();
    await page.keyboard.press("Enter");
    await expect(spel).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Space");
    await expect(spel).toHaveAttribute("aria-pressed", "false");
  });
});

test.describe("navigation", () => {
  test("menyn leder till sektionerna", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Huvudmeny" });
    for (const [label, id] of [
      ["Utvalda", "utvalda"],
      ["Projekt", "projekt"],
      ["Om", "om"],
      ["Kontakt", "kontakt"],
    ] as const) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  test("hoppa till innehållet är första tabbstopp och syns vid fokus", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Hoppa till innehållet" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
  });

  test("alla interaktiva element har synlig fokusmarkering och bilderna är inga tabbstopp", async ({ page }) => {
    await page.goto("/");
    const focusable = page.locator("a[href]:not([tabindex='-1']), button");
    const count = await focusable.count();
    expect(count).toBeGreaterThan(20);
    for (let i = 0; i < count; i += 1) {
      const el = focusable.nth(i);
      await el.focus();
      const outline = await el.evaluate((node) => {
        const style = getComputedStyle(node);
        return { matches: node.matches(":focus-visible"), width: parseFloat(style.outlineWidth), style: style.outlineStyle };
      });
      expect(outline.matches, `fokus på element ${i}`).toBe(true);
      expect(outline.style).not.toBe("none");
      expect(outline.width).toBeGreaterThanOrEqual(2);
    }
    expect(await page.locator("figure a").evaluateAll((els) => els.every((el) => el.getAttribute("tabindex") === "-1"))).toBe(true);
  });
});

test.describe("responsivt", () => {
  for (const width of widths) {
    test(`ingen horisontell scroll eller överlapp vid ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(overflow.scroll).toBeLessThanOrEqual(overflow.client);

      // Inget element sticker ut utanför sidan.
      const outside = await page.evaluate(() => {
        const limit = document.documentElement.clientWidth + 1;
        return Array.from(document.querySelectorAll("main *, header *, footer *"))
          .filter((el) => !el.closest(".sr-only") && !el.classList.contains("sr-only"))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.right > limit || r.left < -1);
          })
          .map((el) => `${el.tagName}.${el.className}`.slice(0, 80));
      });
      expect(outside).toEqual([]);

      // Korten i galleriet överlappar inte varandra.
      const boxes = await page.getByTestId("project-card").evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right };
        }),
      );
      for (let a = 0; a < boxes.length; a += 1) {
        for (let b = a + 1; b < boxes.length; b += 1) {
          const overlap =
            boxes[a].left < boxes[b].right - 1 &&
            boxes[b].left < boxes[a].right - 1 &&
            boxes[a].top < boxes[b].bottom - 1 &&
            boxes[b].top < boxes[a].bottom - 1;
          expect(overlap, `kort ${a} och ${b} överlappar`).toBe(false);
        }
      }

      // Text klipps inte inuti korten.
      const clipped = await page.locator("[data-testid='project-card'] h3, [data-testid='project-card'] p").evaluateAll(
        (els) => els.filter((el) => el.scrollWidth > el.clientWidth + 1).length,
      );
      expect(clipped).toBe(0);
    });
  }

  test("pekytor är minst 44 px höga på mobil", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const small = await page.locator("a[href]:not([tabindex='-1']):visible, button:visible").evaluateAll((els) =>
      els
        .map((el) => ({ h: el.getBoundingClientRect().height, text: el.textContent?.trim().slice(0, 30) }))
        .filter((x) => x.h < 44),
    );
    expect(small).toEqual([]);
  });
});

test.describe("teknik", () => {
  test("inga konsolfel och inga trasiga lokala resurser", async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(`konsol: ${message.text()}`);
    });
    page.on("pageerror", (error) => problems.push(`sidfel: ${error.message}`));
    page.on("response", (response) => {
      if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`);
    });
    page.on("requestfailed", (request) => problems.push(`misslyckades: ${request.url()}`));

    await page.goto("/", { waitUntil: "networkidle" });
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 700) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(100);
    }
    await page.waitForLoadState("networkidle");
    expect(problems).toEqual([]);

    // Sidan hämtar ingenting från andra värdar.
    const external = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((entry) => new URL(entry.name).origin)
        .filter((origin) => origin !== location.origin),
    );
    expect(external).toEqual([]);
  });

  test("metadata, canonical och Open Graph", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Per Björkman/);
    await expect(page.locator("html")).toHaveAttribute("lang", "sv");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /tekniklärare/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://teknikpraktik.se");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\/teknikpraktik\.se\/opengraph-image/);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "sv_SE");
    await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute("href", /.+/);
  });

  test("robots, sitemap, favicon och delningsbild svarar", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain("Sitemap: https://teknikpraktik.se/sitemap.xml");
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain("<loc>https://teknikpraktik.se/</loc>");
    expect((await request.get("/favicon.ico")).ok()).toBe(true);
    const og = await request.get("/opengraph-image.png");
    expect(og.ok()).toBe(true);
    expect(og.headers()["content-type"]).toContain("image/png");
  });

  test("okänd adress ger 404-sidan", async ({ page }) => {
    const response = await page.goto("/finns-inte");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sidan finns inte.");
  });

  test("reducerad rörelse stänger av mjuk scroll och övergångar", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
    const duration = await page
      .locator('button[data-filter="alla"]')
      .evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration));
    expect(duration).toBeLessThan(0.01);
  });
});
