# teknikpraktik.se

Svensk portfolio och projekthubb för Per Björkman. Läs även `AGENTS.md`: Next.js-versionen
här har brytande ändringar, så slå upp i `node_modules/next/dist/docs/` före kodändringar.

## Kommandon

```bash
npm run dev            # utveckling
npm run check          # lint + typkontroll + bygge + Playwright (kör före varje commit)
npm run lighthouse     # kräver: npm run build && npm run start -- -p 3100
npm run thumbnails     # projektbilder, se README
npm run brand          # favicon och delningsbild
```

Testerna körs mot produktionsbygget på port 3100 och återanvänder en server som redan
lyssnar där. Stäng gamla servrar (`fuser -k 3100/tcp`) efter ett nytt bygge, annars testas
det gamla.

## Arkitektur

- En statisk sida (`src/app/page.tsx`) av sektioner i `src/components/`. Enda klientkomponenten
  är `ProjectGallery` (filtren). Allt annat renderas på servern.
- `src/data/projects.ts` är den enda källan för projekt. `types.ts` beskriver fälten.
  Nya projekt ska inte kräva ändringar i komponenterna.
- `src/data/test-data.ts` läser samma fil åt testerna (utan bildimporter).
- Bilder: `src/assets/projects/<slug>.webp`, 1600 × 1000. `manifest.json` skrivs av
  bildverktyget och avgör om en bild presenteras som skärmdump eller illustration.
- Styling: CSS Modules och variabler i `src/app/globals.css`. Inget CSS-ramverk.
- `cacheComponents` är på: inga värden som ändras mellan renderingar (t.ex. `new Date()`)
  i serverkomponenter.

## Kvalitetskrav

- Svenska i allt som besökaren ser. Sakligt och konkret, inga påhittade meriter, kunder,
  siffror eller omdömen.
- Demolänk bara för verifierade adresser, källkodslänk bara för publika repon.
- Offentlig data i `src/data/`, intern dokumentation i `docs/internal/`. Blanda aldrig.
  Repot Zombies är privat: skriv inget om dess inre på webbplatsen.
- Ingen horisontell scroll eller överlapp vid 375, 768 och 1440 px.
- Tangentbord: synlig fokusmarkering, pekytor minst 44 px, kontrast enligt WCAG AA.
- axe utan fynd, Lighthouse minst 90 (prestanda) och 95 (övriga).
- Inga externa resurser vid sidladdning. Typsnitt och bilder ligger i repot.
- Granska projektbilder visuellt innan de checkas in.
- Få beroenden. Lägg inte till ett paket för något som går att skriva på några rader.

## Arbetsstatus

Se `docs/internal/status.md` för läget, öppna frågor och nästa steg.
