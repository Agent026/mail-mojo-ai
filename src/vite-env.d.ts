import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/mail-mojo-ai/", // 👈 change this to your repo name
  plugins: [react()],
});
/// <reference types="vite/client" />
