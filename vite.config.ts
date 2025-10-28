import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// ✅ Safe optional import wrapper
const tryImport = async (pkg) => {
  try {
    const mod = await import(pkg);
    return mod.default || mod;
  } catch {
    console.warn(`⚠️ Skipping optional dev plugin: ${pkg}`);
    return null;
  }
};

export default defineConfig(async ({ mode }) => {
  const plugins = [react()];

  // ✅ Only load these plugins in Replit or dev mode
  if (mode === "development" && process.env.REPL_ID) {
    const runtimeErrorOverlay = await tryImport("@replit/vite-plugin-runtime-error-modal");
    const cartographer = await tryImport("@replit/vite-plugin-cartographer");
    const devBanner = await tryImport("@replit/vite-plugin-dev-banner");

    if (runtimeErrorOverlay) plugins.push(runtimeErrorOverlay());
    if (cartographer) plugins.push(cartographer.cartographer());
    if (devBanner) plugins.push(devBanner.devBanner());
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
