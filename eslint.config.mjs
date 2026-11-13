import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next 16 : eslint-config-next fournit directement une config « flat » (plus de FlatCompat)
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@next/next/no-img-element": "off",
      // Code existant : signalé en avertissement pour ne pas bloquer la CI,
      // à corriger progressivement. Les vraies erreurs (règles des hooks…) restent bloquantes.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "react/no-unescaped-entities": "warn",
      // Nouvelles règles strictes du React Compiler (eslint-config-next 16)
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/purity": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
