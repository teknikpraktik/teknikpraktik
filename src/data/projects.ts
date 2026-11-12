/**
 * Offentlig projektdata för teknikpraktik.se.
 *
 * Allt i den här filen visas för besökare. Interna anteckningar, källor och
 * granskningsunderlag hör hemma i docs/internal/ och importeras aldrig härifrån.
 *
 * Lägg till ett projekt:
 *   1. Skapa ett recept i scripts/thumbnails/recipes/<slug>.mjs och kör `npm run thumbnails -- <slug>`.
 *   2. Importera bilden nedan och lägg till ett objekt i `projects`.
 * Layoutkomponenterna behöver inte ändras. Se README.md.
 */
import manifest from "@/assets/projects/manifest.json";
import bbs from "@/assets/projects/bbs.webp";
import gameOfLife from "@/assets/projects/game-of-life.webp";
import japanForDummies from "@/assets/projects/japan-for-dummies.webp";
import labyrintlab from "@/assets/projects/labyrintlab.webp";
import soloSurvival from "@/assets/projects/solo-survival.webp";
import spidermanWorkout from "@/assets/projects/spiderman-workout.webp";
import svinstark from "@/assets/projects/svinstark.webp";
import vectorRally from "@/assets/projects/vector-rally.webp";
import wxgeek from "@/assets/projects/wxgeek.webp";
import zombies from "@/assets/projects/zombies.webp";
import type { StaticImageData } from "next/image";
import type { Category, CategoryId, ImageKind, Project, ProjectImage } from "./types";

export const categories: Category[] = [
  { id: "larande", label: "Lärande" },
  { id: "spel", label: "Spel" },
  { id: "traning", label: "Träning" },
  { id: "vader", label: "Väder" },
  { id: "resa", label: "Resa" },
];

const kinds = manifest as Record<string, { kind: ImageKind }>;

/** Bildens typ läses från manifestet som bildverktyget skriver, så att den inte kan anges fel för hand. */
function image(slug: string, src: StaticImageData, alt: string): ProjectImage {
  const kind = kinds[slug]?.kind ?? "placeholder";
  return { src, kind, alt: kind === "screenshot" ? alt : "" };
}

const github = (repo: string) => `https://github.com/teknikpraktik/${repo}`;

export const projects: Project[] = [
  {
    slug: "labyrintlab",
    name: "LabyrintLab",
    tagline: "Se hur sökalgoritmer hittar vägen",
    description:
      "Kör BFS, DFS, Greedy, A* och slumpsökning steg för steg i samma labyrint. Jämför hur många rutor de besöker och vilken väg de hittar.",
    featuredText:
      "Ett verktyg för gymnasiekursen Artificiell intelligens. Eleven väljer bana och algoritm, följer sökningen steg för steg och jämför resultaten i en tabell. Banorna är byggda för att visa var Greedy och A* skiljer sig åt, och det går att rita egna.",
    categories: ["larande"],
    status: "live",
    url: "https://labyrintlab.vercel.app/",
    sourceUrl: github("labyrintlab"),
    image: image(
      "labyrintlab",
      labyrintlab,
      "LabyrintLab: en labyrint där A* har markerat besökta rutor och ritat den kortaste vägen i grönt, med mätvärden bredvid.",
    ),
    featured: 1,
  },
  {
    slug: "vector-rally",
    name: "Vector Rally",
    tagline: "Racing på rutat papper",
    description:
      "Turbaserat racingspel för en till fyra spelare på samma skärm. Varje drag ändrar bilens hastighet ett steg, så det gäller att bromsa före kurvan.",
    featuredText:
      "Papper-och-penna-spelet som webbapp. Bilen har en hastighetsvektor, och i varje drag väljer spelaren en av nio accelerationer. Den som kör av banan snurrar och står över fyra drag. Det finns sex banor och en generator som slumpar fram nya.",
    categories: ["spel", "larande"],
    status: "live",
    url: "https://vector-rally.vercel.app/",
    sourceUrl: github("vector-rally"),
    image: image(
      "vector-rally",
      vectorRally,
      "Vector Rally: tre bilar i en kurva på en bana ritad på rutat papper, med varje bils färdväg som en färgad linje.",
    ),
    featured: 2,
  },
  {
    slug: "svinstark",
    name: "Svinstark",
    tagline: "Helkroppspass på 7, 14 eller 21 minuter",
    description:
      "Välj tid, intensitet och utrustning och få ett färdigt helkroppspass. Appen räknar ned varje övning och läser upp vad som kommer härnäst.",
    featuredText:
      "En generator för korta styrkepass. Varje övning pågår i 60 sekunder, och reglerna ser till att passet täcker hela kroppen utan att någon övning upprepas. Passet anpassas efter utrustningen du har, och inställningarna sparas bara på din enhet.",
    categories: ["traning"],
    status: "live",
    url: "https://svinstark.vercel.app/",
    sourceUrl: github("svinstark"),
    image: image(
      "svinstark",
      svinstark,
      "Svinstark på två mobilskärmar: valen av tid, intensitet och utrustning, och ett pågående pass med nedräkning för en övning.",
    ),
    featured: 3,
  },
  {
    slug: "game-of-life",
    name: "Game of Life Lab",
    tagline: "Från enkla regler till logiska grindar",
    description:
      "Rita mönster i Conways Game of Life och följ dem generation för generation. En lektion i sex steg visar hur gliders blir signaler och logiska grindar.",
    categories: ["larande"],
    status: "live",
    url: "https://gameoflife-sandy-tau.vercel.app/",
    sourceUrl: github("game_of_life"),
    image: image(
      "game-of-life",
      gameOfLife,
      "Game of Life Lab: ett rutnät där gliders rör sig längs färgade banor som tillsammans bildar en AND-grind.",
    ),
  },
  {
    slug: "japan-for-dummies",
    name: "Japan for Dummies",
    tagline: "Självstudier inför en skolresa till Japan",
    description:
      "Kurs på svenska i korta kapitel med text, kartor, övningar och test om Japans geografi, historia, vardag och språk. Framstegen sparas i webbläsaren.",
    categories: ["resa", "larande"],
    status: "live",
    note: "Pilot",
    url: "https://japan-for-dummies.vercel.app/",
    sourceUrl: github("japan-for-dummies"),
    image: image(
      "japan-for-dummies",
      japanForDummies,
      "Japan for Dummies: startsidan med kursens upplägg, ett foto av röda torii-portar och en lista med teman.",
    ),
  },
  {
    slug: "wxgeek",
    name: "WXGEEK",
    tagline: "Observationer och prognos på samma tidslinje",
    description:
      "Väderapp för Sverige som visar de senaste tolv timmarnas observationer och det kommande dygnets prognos på en tidsaxel, med data från METAR, TAF och SMHI.",
    categories: ["vader"],
    status: "no-demo",
    sourceUrl: github("WXGEEK"),
    image: image(
      "wxgeek",
      wxgeek,
      "WXGEEK: vädret i Karlstad som en tidslinje med moln och nederbörd, temperatur och vind, från observation till prognos.",
    ),
  },
  {
    slug: "solo-survival",
    name: "Solo Survival",
    tagline: "GPS-spel där zombier jagar dig längs stigarna",
    description:
      "Gå eller cykla på riktigt medan zombier följer verkliga stigar och vägar mot dig. Banan med checkpoints byggs av kartdata från OpenStreetMap.",
    categories: ["spel"],
    status: "no-demo",
    note: "Prototyp",
    sourceUrl: github("solosurvival"),
    image: image(
      "solo-survival",
      soloSurvival,
      "Solo Survival på två mobilskärmar: en bana med sex checkpoints på en mörk karta, och en pågående match där en zombie närmar sig spelaren.",
    ),
  },
  {
    slug: "zombies",
    name: "Zombies",
    tagline: "Människor mot zombier, utomhus med GPS",
    description:
      "Jaktlek för upp till 25 spelare i ett område som spelledaren ritar på kartan. Zombierna jagar, och människorna vinner genom att nå helikoptern i tid.",
    categories: ["spel"],
    status: "no-demo",
    image: image(
      "zombies",
      zombies,
      "Zombies på två mobilskärmar: startskärmen med spelets titel, och en karta över spelområdet med människor, zombier och en upphämtningszon.",
    ),
  },
  {
    slug: "bbs",
    name: "BBS – Body by Science",
    tagline: "Fem maskinövningar, ett set vardera",
    description:
      "Tar tid på varje set, högst 90 sekunder, och sparar vikten du slutade på. Utvecklingen visas som diagram, och allt lagras på din enhet.",
    categories: ["traning"],
    status: "live",
    url: "https://bbs-gamma-smoky.vercel.app/",
    sourceUrl: github("BBS"),
    image: image(
      "bbs",
      bbs,
      "BBS på två mobilskärmar: listan med passets fem övningar, och en tidtagare med färgad ring för ett pågående set.",
    ),
  },
  {
    slug: "spiderman-workout",
    name: "Spiderman Workout",
    tagline: "Så många varv du hinner på 20 minuter",
    description:
      "Ett enda pass: 5 chins, 10 armhävningar och 15 knäböj, varv efter varv. Appen tar tiden, räknar varven och sparar ditt personbästa på enheten.",
    categories: ["traning"],
    status: "live",
    url: "https://spidermanwo.vercel.app/",
    sourceUrl: github("spidermanwo"),
    image: image(
      "spiderman-workout",
      spidermanWorkout,
      "Spiderman Workout på två mobilskärmar: startskärmen med passets tre övningar, och ett pågående pass med nedräkning och sju avklarade varv.",
    ),
  },
];

export const featuredProjects = projects
  .filter((project) => project.featured !== undefined)
  .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));

export const categoryLabel = (id: CategoryId) =>
  categories.find((category) => category.id === id)?.label ?? id;

/** Kategorier som faktiskt används, i den ordning de är definierade. */
export const usedCategories = categories.filter((category) =>
  projects.some((project) => project.categories.includes(category.id)),
);
