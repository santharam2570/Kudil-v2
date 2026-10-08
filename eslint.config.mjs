import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", "node_modules/**", "legacy-vite/**", "next-env.d.ts"] },
  {
    // R3F mutates three.js objects imperatively inside useFrame by design.
    files: ["src/three/**"],
    rules: { "react-hooks/immutability": "off", "react-hooks/purity": "off" },
  },
];

export default config;
