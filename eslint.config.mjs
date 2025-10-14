import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ✅ Include Next.js and TypeScript defaults
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ Custom config block
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // 🚫 Disable the annoying React hook dependency warnings
      "react-hooks/exhaustive-deps": "off",

      // 🚫 (Optional) disable "Unexpected any" errors too
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
