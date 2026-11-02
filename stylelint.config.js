/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["dist/**", ".netlify/**", "coverage/**"],
  rules: {
    // BEM: block, block__element, block--modifier, block__element--modifier
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$",
      { message: (selector) => `Expected class selector "${selector}" to be BEM` },
    ],
    // kebab-case, plus the fluid type scale's negative steps (--step--1)
    "custom-property-pattern": [
      "^[a-z][a-z0-9]*(-{1,2}[a-z0-9]+)*$",
      { message: (name) => `Expected custom property "${name}" to be kebab-case` },
    ],
    // font names keep their capitals, and currentColor its camel case
    "value-keyword-case": [
      "lower",
      { camelCaseSvgKeywords: true, ignoreProperties: ["font-family", "/^--font-/"] },
    ],
    // Nested BEM selectors (&:hover .block__element) trip this constantly without being bugs
    "no-descending-specificity": null,
  },
};
