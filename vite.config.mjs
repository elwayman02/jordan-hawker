import { ember } from "@nullvoxpopuli/ember-vite";
import netlify from "@netlify/vite-plugin";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    ember(),
    // Icons are imported as raw SVG strings: `import github from "~icons/ri/github-fill"`
    Icons({ compiler: "raw", scale: 1 }),
    // Runs netlify/functions, Blobs, _redirects and headers inside `pnpm dev`.
    // Edge functions are unused, and their emulator needs a specific Deno version.
    netlify({ edgeFunctions: { enabled: false } }),
  ],
});
