import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Replace 'YOUR_REPO_NAME' with your actual GitHub repo name
const repoBase = process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/';

export default defineConfig(({ mode }) => ({
  base: repoBase,  // ✅ Set the base path for GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
