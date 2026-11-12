import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".cache/**",
    "reports/**",
    "test-results/**",
  ]),
  {
    // Recepten för projektbilder exporterar ett objekt direkt, vilket är avsikten.
    files: ["scripts/thumbnails/recipes/*.mjs"],
    rules: { "import/no-anonymous-default-export": "off" },
  },
]);

export default eslintConfig;
