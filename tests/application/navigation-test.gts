import { click, currentURL, settled, visit, waitUntil } from "@ember/test-helpers";
import { afterEach, beforeEach, describe, expect } from "vitest";
import { applicationTest } from "ember-vitest";

import App from "#app/app.ts";
import { fakeApi, resetApi } from "#test-helpers/fake-api.ts";

const text = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, " ").trim();

describe("navigation", () => {
  // vitest fixtures must destructure their context argument
  // eslint-disable-next-line no-empty-pattern
  applicationTest.override({ app: ({}, use) => use(App) });

  beforeEach(() => fakeApi());
  afterEach(() => resetApi());

  applicationTest("home shows experience, projects, sound and Bluesky", async ({ element }) => {
    await visit("/");

    expect(text(element.querySelector(".hero__title"))).toContain("Hi, I’m Jordan.");
    expect(text(element.querySelector(".timeline"))).toContain("Staff Software Engineer");
    expect(text(element.querySelector(".project-card__name"))).toContain("ember-user-activity");
    expect(text(element.querySelector(".track__title"))).toContain("Panorama");
    expect(element.querySelectorAll(".skeet")).toHaveLength(1);
    expect(text(element.querySelector(".hella__posts"))).toContain("Akashi White Oak");
    expect(document.title).toBe("Jordan Hawker");
  });

  applicationTest("the five-letter nav reaches every section", async ({ element }) => {
    await visit("/");

    for (const section of ["works", "codes", "sound", "words"]) {
      await click(`.site-nav a[aria-label="${section}"]`);
      // link clicks navigate inside a View Transition, after the old page is snapshotted
      await waitUntil(() => currentURL() === `/${section}`);

      expect(currentURL()).toBe(`/${section}`);
      expect(element.querySelector(".site-nav .active")?.getAttribute("aria-label")).toBe(section);
    }
  });

  applicationTest("works renders the structured resume", async ({ element }) => {
    await visit("/works");

    expect(text(element.querySelector(".resume__name"))).toBe("Jordan Hawker");
    expect(text(element.querySelector(".resume__list strong"))).toBe("46 repositories");
    expect(element.querySelectorAll(".recommendation").length).toBeGreaterThan(10);
    expect(document.title).toBe("Works · Jordan Hawker");
  });

  applicationTest("codes lists active projects and an archive", async ({ element }) => {
    await visit("/codes");

    expect(element.querySelectorAll(".project-card")).toHaveLength(1);
    expect(text(element.querySelector(".archive summary"))).toContain("1 older projects");
  });

  applicationTest("posts open from the list", async ({ element }) => {
    await visit("/words");

    await click(".post-item__title a");
    await waitUntil(() => currentURL() === "/words/187541610821");
    await settled();

    expect(currentURL()).toBe("/words/187541610821");
    expect(text(element.querySelector(".article h1"))).toBe("ember-sinon-qunit v4");
    expect(text(element.querySelector(".prose"))).toContain("read on");
  });

  applicationTest("unknown posts and pages say so", async ({ element }) => {
    await visit("/words/nope");

    expect(text(element.querySelector("h1"))).toBe("Post not found");

    await visit("/somewhere/else");

    expect(text(element.querySelector("h1"))).toBe("Nothing here.");
  });
});

describe("when a source is down", () => {
  // vitest fixtures must destructure their context argument
  // eslint-disable-next-line no-empty-pattern
  applicationTest.override({ app: ({}, use) => use(App) });

  beforeEach(() => fakeApi({ failing: ["/api/resume", "bluesky"] }));
  afterEach(() => resetApi());

  applicationTest("pages degrade to helpful notices", async ({ element }) => {
    await visit("/works");

    expect(text(element.querySelector(".notice"))).toContain("read it on Google Docs");

    await visit("/words");

    expect(text(element.querySelector(".bluesky .notice"))).toContain("see posts on bsky.app");
  });
});
