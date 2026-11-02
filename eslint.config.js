/**
 * This tries to follow what the official blueprints are doing more closely
 * but in a way that abstracts the dependencies and configuration
 * out of your project.
 *
 * Handles: (G)TS + (G)JS, QUnit, Supporting Node files
 */
import { ember } from "ember-eslint";
import templateLintMigration from "eslint-plugin-ember/configs/template-lint-migration";

/**
 * ember-template-lint's recommended rules, as ported into eslint-plugin-ember.
 * `ember.recommended()` turns on almost none of them. Only the rules are taken: ember-eslint
 * already registers the plugin and the .gts/.gjs parser.
 */
const templateRules = Object.assign({}, ...templateLintMigration.map((config) => config.rules));

export default [
  ...ember.recommended(import.meta.dirname),
  { ignores: [".netlify/", "dist/", "tests/**/__screenshots__/"] },
  { files: ["**/*.{gts,gjs}"], rules: templateRules },
  // Tests use vitest's `expect`, not QUnit's assertion counting
  { files: ["tests/**/*"], rules: { "qunit/require-expect": "off" } },
  // your modifications here
  // see: https://eslint.org/docs/user-guide/configuring/configuration-files#how-do-overrides-work
];
