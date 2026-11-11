/**
 * Offentlig information om webbplatsen och avsändaren.
 * Allt i den här filen visas för besökare. Lägg inga interna anteckningar här.
 */
export const site = {
  name: "Teknikpraktik",
  domain: "teknikpraktik.se",
  url: "https://teknikpraktik.se",
  author: "Per Björkman",
  title: "Per Björkman – digitala verktyg för lärande, spel och vardag",
  description:
    "Per Björkman är tekniklärare med bakgrund som civilingenjör och trafikflygare. Här samlas hans webbappar för lärande, spel, träning, väder och resor.",
  locale: "sv_SE",
  /**
   * Kontaktväg. Ingen offentlig e-postadress är verifierad, därför används
   * GitHub-profilen tills vidare. Se docs/internal/beslut.md.
   */
  contact: {
    label: "GitHub",
    handle: "github.com/teknikpraktik",
    url: "https://github.com/teknikpraktik",
  },
} as const;

export const navigation = [
  { href: "#utvalda", label: "Utvalda" },
  { href: "#projekt", label: "Projekt" },
  { href: "#om", label: "Om" },
  { href: "#kontakt", label: "Kontakt" },
] as const;
