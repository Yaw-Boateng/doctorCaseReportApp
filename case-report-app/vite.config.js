import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // 2. Use import.meta.dirname to point to your local src folder
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
