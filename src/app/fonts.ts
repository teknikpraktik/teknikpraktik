import localFont from "next/font/local";

/** Rubriker. Newsreader (OFL 1.1), variabel vikt, latin. */
export const display = localFont({
  src: "../fonts/newsreader-latin-wght-normal.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-display",
  adjustFontFallback: "Times New Roman",
});

/** Brödtext och gränssnitt. IBM Plex Sans (OFL 1.1), variabel vikt, latin. */
export const sans = localFont({
  src: "../fonts/ibm-plex-sans-latin-wght-normal.woff2",
  weight: "100 700",
  style: "normal",
  display: "swap",
  variable: "--font-sans",
  adjustFontFallback: "Arial",
});

/** Etiketter och metadata. IBM Plex Mono (OFL 1.1), 400, latin. */
export const mono = localFont({
  src: "../fonts/ibm-plex-mono-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-mono",
  preload: false,
  adjustFontFallback: false,
});
