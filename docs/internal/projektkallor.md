# Projektkällor och verifiering

Intern arbetsdokumentation. Visas inte på webbplatsen. Kontrollerat 2026-11-11.

Adresserna kommer från respektive repos webbplatsfält på GitHub och har besökts.
Inga adresser har gissats utifrån reponamn.

| Projekt | Repo | Synlighet | Adress | Resultat |
| --- | --- | --- | --- | --- |
| LabyrintLab | labyrintlab | publik | labyrintlab.vercel.app | 200, appen fungerar |
| Game of Life Lab | game_of_life | publik | gameoflife-sandy-tau.vercel.app | 200, appen fungerar |
| Japan for Dummies | japan-for-dummies | publik | japan-for-dummies.vercel.app | 200, appen fungerar |
| Vector Rally | vector-rally | publik | vector-rally.vercel.app | 200, appen fungerar |
| Svinstark | svinstark | publik | svinstark.vercel.app | 200, appen fungerar |
| BBS | BBS | publik | bbs-gamma-smoky.vercel.app | 200, appen fungerar |
| Spiderman Workout | spidermanwo | publik | spidermanwo.vercel.app | 200, appen fungerar |
| WXGEEK | WXGEEK | publik | vaderlek.vercel.app | 404 `DEPLOYMENT_NOT_FOUND` |
| Solo Survival | solosurvival | publik | solosurvival-iota.vercel.app | 404 `DEPLOYMENT_NOT_FOUND` |
| Zombies | zombies | privat | zombies-eight.vercel.app | 404 `DEPLOYMENT_NOT_FOUND` |

## Saknade adresser

De tre sista adresserna finns inte längre hos Vercel. Projekten visas därför med status
"Ingen publik demo" och utan demolänk. Bilderna är tagna från lokala körningar av repona.

- **Solo Survival.** Vercel-botens kommentar i repots senaste PR visar att projektet numera
  heter `solosurvival-6r2m`. `solosurvival-6r2m.vercel.app` provades och gav också 404.
  Produktionsadressen går inte att läsa ut utan åtkomst till Vercel.
- **WXGEEK och Zombies.** Ingen deploymentinformation var åtkomlig via GitHub.

Åtgärd när rätt adress är känd: sätt `url` och `status: "live"` i `src/data/projects.ts`,
byt `url` i receptet och ta bort `local`-blocket, kör `npm run thumbnails -- <slug>`.
Uppdatera gärna också webbplatsfältet i GitHub-repot.

## Avvikelser mot utgångsbeskrivningen

- **Vector Rally** har inga datorstyrda motståndare. README anger att de togs bort. Spelet
  är för en till fyra spelare på samma skärm.
- **Japan for Dummies** kallas "Japanresan 2027" i README. Appen själv heter
  "Japan for Dummies". README anger status pilot, därav noteringen "Pilot".
- **Solo Survival** heter "OUTBREAK – Solo Survival" i appen. README:s statustabell är
  inaktuell: ett spelbart flöde finns, men projektets dokument anger att det inte är
  provat färdigt på riktig telefon. Därav noteringen "Prototyp".
- **Spiderman Workout.** Repots README påpekar själv att namnet ligger nära ett
  varumärke och att ett annat namn behövs före en publik lansering. Appen använder inga
  bilder från Marvel. Namnet används här eftersom det är appens namn. Beslut för Per.
- **BBS, Spiderman Workout, Vector Rally, WXGEEK, Solo Survival och Zombies** har engelskt
  gränssnitt.

## Hur bilderna togs

| Projekt | Källa | Anmärkning |
| --- | --- | --- |
| LabyrintLab, Game of Life Lab, Japan for Dummies | liveappen | inga inmatade uppgifter |
| Vector Rally | liveappen | loppet byggs med spelets egen motor och läses in via appens JSON-inläsning, namn "Spelare 1–3" |
| Svinstark, BBS | liveappen | syntetiska val, 40 kg |
| Spiderman Workout | liveappen | påhittad pågående session i localStorage |
| WXGEEK | lokal körning, commit 4c6177b | riktiga öppna data från SMHI och aviationweather.gov, plats Karlstad |
| Solo Survival | lokal körning, commit adc99bd | simulerad GPS, zombier flyttade närmare med appens felsökningsläge |
| Zombies | lokal körning, commit 9870d1e | ingen databas, spelvyn ritas mot ett påhittat speltillstånd, namn "Player 1–4" |

Japan for Dummies: fotot på startsidan (torii-portar) är enligt projektets bildregister
CC0 1.0 från Wikimedia Commons. Zombies: startskärmens illustration är appens egen.
