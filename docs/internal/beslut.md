# Beslut och antaganden

Intern arbetsdokumentation. Visas inte på webbplatsen.

## Innehåll

- **Kontaktväg.** Ingen offentlig e-postadress har kunnat verifieras som avsedd för
  publicering. GitHub-profilen (github.com/teknikpraktik) används tills vidare. Byts i
  `src/data/site.ts`.
- **Texten om Per** bygger enbart på uppgifterna i uppdraget: tekniklärare,
  civilingenjörsbakgrund, tidigare trafikflygare. Inga arbetsgivare, årtal eller meriter är
  tillagda. Formuleringarna bör läsas igenom av Per.
- **Utvalda projekt:** LabyrintLab (lärande), Vector Rally (spel) och Svinstark (träning).
  Valda för bredd och för att alla tre går att öppna. WXGEEK är en stark kandidat när
  appen har en publik adress.
- **Kategorier:** Lärande, Spel, Träning, Väder, Resa.
- **Zombies** är ett privat repo. Texten beskriver bara det en spelare ser. Ingen länk.
- **Länkar** öppnas i samma flik. Pilen markerar att länken lämnar webbplatsen.

## Form

- Varm, ljus grund (#f5f2ec), nästan svart text och en enda accentfärg (rostrött #a83c1b).
- Rubriker i Newsreader, text i IBM Plex Sans, etiketter i IBM Plex Mono.
- Projektbilderna står för färgen. Inga gradienter, inga dekorativa mätvärden.
- Rörelse: korta övergångar på länkar, knappar och bildernas hover. Stängs av vid
  `prefers-reduced-motion`.
- Endast ljust tema i v1.

## Kontrast (WCAG AA, normal text kräver 4,5:1)

| Förgrund | Bakgrund | Kvot |
| --- | --- | --- |
| #17181c text | #f5f2ec | 15,9 |
| #44464e sekundär text | #f5f2ec | 8,5 |
| #5c5e66 etiketter | #f5f2ec | 5,8 |
| #a83c1b accent | #f5f2ec | 5,6 |
| #f5f2ec | #17181c knappar | 15,9 |

## Teknik

- Typsnitten ligger i repot. Inga anrop till andra tjänster vid sidladdning.
- Projektbilderna importeras statiskt, så bygget faller om en bild saknas.
- `next/image` levererar AVIF/WebP i rätt storlek med reserverade mått.
