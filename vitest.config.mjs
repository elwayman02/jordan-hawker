import { ember } from "@nullvoxpopuli/ember-vite";
import { webdriverio } from "@vitest/browser-webdriverio";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [ember(), Icons({ compiler: "raw", scale: 1 })],
        test: {
          name: "browser",
          include: ["tests/**/*-test.{js,ts,gjs,gts}"],
          setupFiles: ["./tests/helpers/setup.ts"],
          maxConcurrency: 1,
          passWithNoTests: true,
          browser: {
            provider: webdriverio(),
            enabled: true,
            headless: true,
            instances: [{ browser: "chrome" }],
          },
        },
      },
      {
        test: {
          name: "node",
          include: ["server/**/*.test.ts"],
          environment: "node",
        },
      },
    ],
  },
});
