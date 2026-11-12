/**
 * Projektdata utan bildimporter, för testerna (Playwright kan inte läsa .webp-importer).
 * Läser samma källa som webbplatsen, så testerna följer med när projekt läggs till.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Category, Project } from "./types";

type Plain = Omit<Project, "image">;

const source = readFileSync(path.join(process.cwd(), "src/data/projects.ts"), "utf8");

function block(name: string) {
  const start = source.indexOf(`export const ${name}`);
  const open = source.indexOf("= [", start) + 2;
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "[") depth += 1;
    if (source[i] === "]") depth -= 1;
    if (depth === 0) return source.slice(open, i + 1);
  }
  throw new Error(`hittar inte ${name}`);
}

const github = (repo: string) => `https://github.com/teknikpraktik/${repo}`;
const image = () => null;
void github;
void image;

// Datafilen är ren objektsyntax. Bildreferenserna byts mot null innan den tolkas.
const evaluate = <T>(code: string): T =>
  new Function("github", "image", `return ${code.replace(/image\(\s*"[^"]+",\s*\w+,/g, 'image("",null,')};`)(github, image) as T;

export const categories = evaluate<Category[]>(block("categories"));
export const projects = evaluate<Plain[]>(block("projects"));
export const featuredProjects = projects
  .filter((p) => p.featured !== undefined)
  .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
