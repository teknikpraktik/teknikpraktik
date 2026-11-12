# teknikpraktik.se

Portfolio och projekthubb för Per Björkman. En statiskt genererad startsida byggd med
Next.js (App Router), TypeScript och CSS Modules. Ingen databas, ingen inloggning, inget CMS.

## Kom igång

```bash
npm install
npm run dev          # http://localhost:3000
```

Kräver Node 20.9 eller senare.

| Kommando | Gör |
| --- | --- |
| `npm run dev` | Utvecklingsserver |
| `npm run build` | Produktionsbygge |
| `npm run start` | Kör produktionsbygget |
| `npm run lint` | ESLint |
| `npm run typecheck` | Typkontroll |
| `npm test` | Playwright-tester mot produktionsbygget (kör `npm run build` först) |
| `npm run check` | Lint, typkontroll, bygge och tester i följd |
| `npm run lighthouse` | Lighthouse mot en körande produktionsserver på port 3100 |
| `npm run thumbnails` | Uppdaterar projektbilderna |
| `npm run brand` | Skapar favicon, appikon och delningsbild |

Testerna startar själva `next start` på port 3100 om ingen server redan svarar där. Om en
gammal server ligger kvar på porten testas det gamla bygget, så stäng den först.

## Struktur

```
src/app/            layout, startsida, metadata, robots, sitemap, ikoner, delningsbild
src/components/     sidans sektioner och projektkort (CSS Modules)
src/data/           projects.ts (all offentlig projektdata), site.ts, types.ts
src/assets/projects projektbilder (webp, 1600 × 1000) och manifest.json
src/fonts/          typsnitt, lagrade lokalt
scripts/thumbnails/ bildverktyget och ett recept per projekt
scripts/brand/      favicon och delningsbild
tests/              Playwright-tester, inklusive tillgänglighet med axe
docs/internal/      arbetsdokumentation, visas aldrig på webbplatsen
```

Allt som står i `src/data/` visas för besökare. Källor, beslut och granskningsanteckningar
ligger i `docs/internal/` och importeras aldrig av koden.

## Lägga till ett projekt

1. **Recept för bilden.** Skapa `scripts/thumbnails/recipes/<slug>.mjs`. Kopiera ett
   befintligt recept: `labyrintlab.mjs` för en webbapp på bred skärm, `svinstark.mjs` för en
   mobilapp. Receptet anger adress, enhet och hur man tar sig till en representativ vy.
2. **Ta bilden.** `npm run thumbnails -- <slug>`. Öppna `src/assets/projects/<slug>.webp` och
   kontrollera den (se nedan).
3. **Lägg till projektet** i `src/data/projects.ts`: importera bilden överst och lägg till ett
   objekt i `projects`. Fälten är beskrivna i `src/data/types.ts`.
4. Kör `npm run check`. Testerna läser projektlistan och följer med automatiskt.

Layoutkomponenterna behöver inte ändras. En ny kategori läggs till i `CategoryId` i
`types.ts` och i `categories` i `projects.ts`.

Regler för projektdata:

- `url` sätts bara när adressen är kontrollerad och appen svarar. Utan `url` ska
  `status` vara `"no-demo"`. Då visas ingen demolänk och statusen "Ingen publik demo".
- `sourceUrl` sätts bara för publika repon.
- Skriv bara det som går att belägga i appen eller dess dokumentation.

## Uppdatera projektbilder

```bash
npm run thumbnails                       # alla projekt
npm run thumbnails -- labyrintlab bbs    # bara de angivna
npm run thumbnails -- --placeholders     # reservbild där bild saknas
```

Verktyget besöker varje projekt med Playwright, följer receptet, tar en skärmdump och sparar
en optimerad bild i 16:10 (1600 × 1000, webp). Webbappar för bred skärm visas som de är.
Mobilappar fotograferas i mobilformat och sätts in som en eller flera telefonskärmar på en
lugn bakgrund, med appens proportioner bevarade.

- Ett fel i ett projekt stoppar inte de övriga. Kommandot skriver en sammanställning och
  avslutar med felkod om något gick fel.
- Om en ny bild inte kan tas behålls den befintliga. Saknas bild helt skapas en formgiven
  reservbild med projektnamnet. `manifest.json` håller reda på vilka bilder som är
  skärmdumpar, och webbplatsen märker reservbilder som "Illustration, ingen skärmdump".
- Råbilderna sparas i `.cache/thumbnails/` för granskning.

**Granska alltid nya bilder innan de checkas in.** En bild får inte visa personuppgifter,
felmeddelanden, tomma laddningsvyer eller blockerande dialogrutor. Recepten använder bara
syntetiska uppgifter och simulerad position.

### Projekt utan publik adress

Tre projekt (WXGEEK, Solo Survival, Zombies) saknar verifierad publik adress och
fotograferas från en lokal körning. Recepten har ett `local`-block med kommandona.

```bash
# en mapp som innehåller kloner av wxgeek/, solosurvival/ och zombies/
npm run thumbnails -- --local-root ~/src --build wxgeek solo-survival zombies
```

`--build` installerar och bygger först. Utan `--local-root` hoppas dessa projekt över och
deras befintliga bilder behålls. När ett projekt får en publik adress: byt `url` i receptet,
ta bort `local`-blocket och sätt `url` och `status: "live"` i `projects.ts`.

## Typsnitt

Newsreader, IBM Plex Sans och IBM Plex Mono, alla under SIL Open Font License 1.1.
Filerna ligger i `src/fonts/` och hämtas inte från någon annan tjänst.

## Driftsättning

Repot är kopplat till ett Vercel-projekt. Inga miljövariabler behövs. Canonical-adress,
sitemap och Open Graph pekar på `https://teknikpraktik.se` (se `src/data/site.ts`).
