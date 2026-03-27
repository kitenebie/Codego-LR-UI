import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm", "iife"], // <-- IIFE is for CDN
  globalName: "CodegoUI",          // <-- global variable name for browser
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
});