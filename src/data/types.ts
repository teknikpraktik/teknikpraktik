import type { StaticImageData } from "next/image";

/** Kategorier som visas som filter. Lägg till en ny här och i `categories` i projects.ts. */
export type CategoryId = "larande" | "spel" | "traning" | "vader" | "resa";

export interface Category {
  id: CategoryId;
  /** Visas i filter och på kort. */
  label: string;
}

/**
 * `live`    – publik adress verifierad, länk visas.
 * `no-demo` – ingen verifierad publik adress, ingen demolänk visas.
 */
export type ProjectStatus = "live" | "no-demo";

/** Hur bilden har kommit till. Styr bildtexten så att en reservbild aldrig ser ut som en skärmdump. */
export type ImageKind = "screenshot" | "placeholder";

export interface ProjectImage {
  src: StaticImageData;
  /** Beskriver vad bilden visar, på svenska. */
  alt: string;
  kind: ImageKind;
}

export interface Project {
  /** Stabilt id, används i ankare, tester och filnamn (src/assets/projects/<slug>.webp). */
  slug: string;
  /** Visningsnamn. */
  name: string;
  /** En rad som säger vad det är. */
  tagline: string;
  /** Kort, konkret beskrivning av nyttan. Visas på kortet i galleriet. */
  description: string;
  /** Längre text för utvalda projekt. Krävs om `featured` är satt. */
  featuredText?: string;
  categories: CategoryId[];
  status: ProjectStatus;
  /** Mognadsgrad eller annan kort notering som projektet själv anger, t.ex. "Prototyp". */
  note?: string;
  /** Verifierad publik adress. Sätts bara när adressen är kontrollerad. */
  url?: string;
  /** Länk till källkoden. Sätts bara för publika repon. */
  sourceUrl?: string;
  image: ProjectImage;
  /** Position bland utvalda projekt (1–3). Utelämnas för övriga. */
  featured?: number;
}
