import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if running in Replit environment
const isReplit = process.env.REPL_ID !== undefined;

export default defineConfig(async () => {
  // Conditionally load Replit plugins only when in Replit environment
  const replitPlugins = [];
  if (isReplit) {
    try {
      const themePlugin = await import("@replit/vite-plugin-shadcn-theme-json").then(m => m.default);
      const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal").then(m => m.default);
      replitPlugins.push(themePlugin(), runtimeErrorOverlay());

      if (process.env.NODE_ENV !== "production") {
        const cartographer = await import("@replit/vite-plugin-cartographer").then(m => m.cartographer);
        replitPlugins.push(cartographer());
      }
    } catch (e) {
      // Replit plugins not available, continue without them
    }
  }

  return {
    plugins: [
      react(),
      ...replitPlugins,
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
  };
});
