import { ember } from "@nullvoxpopuli/ember-vite";
import { webdriverio } from "@vitest/browser-webdriverio";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [ember()],
  test: {
    include: ["tests/**/*-test.{js,ts,gjs,gts}"],
    maxConcurrency: 1,
    passWithNoTests: true,
    browser: {
      provider: webdriverio(),
      enabled: true,
      headless: true,
      instances: [{ browser: "chrome" }],
    },
  },
});
