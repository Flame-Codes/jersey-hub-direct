import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Allow connections from any host
    port: 8080,
    allowedHosts: [
      "jersey-hub-direct.onrender.com", // Add your Render host
      "localhost",
      "127.0.0.1",
    ],
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  preview: {
    host: true,
    port: 8080,
    allowedHosts: "all", // Optional for preview
  },
}));
