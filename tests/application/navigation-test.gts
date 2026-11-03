import {
  click,
  currentRouteName,
  currentURL,
  fillIn,
  settled,
  visit,
  waitUntil,
} from "@ember/test-helpers";
import { afterEach, beforeEach, describe, expect } from "vitest";
import { applicationTest } from "ember-vitest";

import App from "#app/app.ts";
import { fakeApi, resetApi } from "#test-helpers/fake-api.ts";
import { SECTIONS } from "#shared/sections.ts";

const text = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, " ").trim();

describe("navigation", () => {
  // vitest fixtures must destructure their context argument
  // eslint-disable-next-line no-empty-pattern
  applicationTest.override({ app: ({}, use) => use(App) });

  beforeEach(() => fakeApi());
  afterEach(() => resetApi());

  applicationTest("every section in shared/sections.ts has a page", async ({ element }) => {
    for (const { name, label } of SECTIONS) {
      await visit(`/${name}`);

      expect(currentRouteName(), name).toMatch(new RegExp(`^${name}(\\.|$)`));
      expect(text(element.querySelector(".page-header .eyebrow")), name).toBe(name);
      expect(document.title, name).toContain(label);
    }
  });

  applicationTest("home shows experience, projects, sound and Bluesky", async ({ element }) => {
    await visit("/");

    expect(text(element.querySelector(".hero__title"))).toContain("Hi, I’m Jordan.");
    expect(text(element.querySelector(".timeline"))).toContain("Staff Software Engineer");
    expect(text(element.querySelector(".project-card__name"))).toContain("ember-user-activity");
    expect(text(element.querySelector(".track__title"))).toContain("Panorama");

    const reading = element.querySelector("[aria-labelledby=home-reads]");

    expect(text(reading?.querySelector("h2"))).toBe("Currently reading");
    expect(text(reading?.querySelector(".book--featured .book__title"))).toBe("All Hail Chaos");
    expect(reading?.querySelector('a[href="/reads"]')).not.toBeNull();

    // beside it, what I've been listening to
    const listening = element.querySelector("[aria-labelledby=home-listening]");

    expect(text(listening?.querySelector("h2"))).toBe("Currently listening");
    expect([...(listening?.querySelectorAll(".scrobble__name") ?? [])].map(text)).toEqual([
      "Pandora's Box",
      "Left Alone (feat. Chet Faker)",
    ]);
    expect(listening?.querySelector('a[href="/sound"]')).not.toBeNull();
    expect(reading?.parentElement).toBe(listening?.parentElement);

    const [liked, quiet] = element.querySelectorAll(".skeet");

    expect(element.querySelectorAll(".skeet")).toHaveLength(2);
    // only non-zero counts show, and nothing at all when every count is zero
    expect(
      [...liked!.querySelectorAll(".skeet__stats [title]")].map((stat) =>
        stat.getAttribute("title"),
      ),
    ).toEqual(["Likes"]);
    expect(text(liked!.querySelector(".skeet__stats"))).toBe("3");
    expect(quiet!.querySelector(".skeet__stats")).toBeNull();
    expect(quiet!.querySelector(".skeet__meta time")).not.toBeNull();
    expect(text(element.querySelector(".hella__posts"))).toContain("Akashi White Oak");
    expect(document.title).toBe("Jordan Hawker");
  });

  applicationTest("the five-letter nav reaches every section", async ({ element }) => {
    await visit("/");

    // /votes settles on the latest guide's own address
    const landing: Record<string, string> = { votes: "/votes/2026" };

    for (const { name: section } of SECTIONS) {
      const url = landing[section] ?? `/${section}`;

      expect(
        element.querySelector(`.site-nav a[aria-label="${section}"]`)?.getAttribute("href"),
      ).toBe(`/${section}`);

      await click(`.site-nav a[aria-label="${section}"]`);
      // link clicks navigate inside a View Transition, after the old page is snapshotted
      await waitUntil(() => currentURL() === url);

      expect(currentURL()).toBe(url);
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

  applicationTest(
    "the /words sidebar leads with Hella Drunk, then Bluesky",
    async ({ element }) => {
      await visit("/words");

      const aside = element.querySelector(".words__aside");
      const cards = [...(aside?.querySelectorAll(":scope > .hella, :scope > .bluesky") ?? [])];

      expect(cards.map((card) => card.classList[0])).toEqual(["hella", "bluesky"]);
    },
  );

  applicationTest("posts open from the list", async ({ element }) => {
    await visit("/words");

    await click(".post-item__title a");
    await waitUntil(() => currentURL() === "/words/187541610821");
    await settled();

    expect(currentURL()).toBe("/words/187541610821");
    expect(text(element.querySelector(".article h1"))).toBe("ember-sinon-qunit v4");
    expect(text(element.querySelector(".prose"))).toContain("read on");
  });

  applicationTest("sound shows what I'm listening to on Last.fm", async ({ element }) => {
    await visit("/sound");

    const section = element.querySelector("[aria-labelledby=listening]");
    const [latest, played] = section?.querySelectorAll(".scrobble") ?? [];

    expect(text(section?.querySelector("h2"))).toBe("What I’m listening to");
    // styles from Last.fm's tags, where they loaded
    const [tPain, halsey] = section?.querySelectorAll(".top-artists__item") ?? [];

    expect(text(tPain?.querySelector("a"))).toBe("T-Pain");
    expect([...(tPain?.querySelectorAll(".chip") ?? [])].map(text)).toEqual([
      "hip-hop",
      "rnb",
      "auto-tune",
    ]);
    expect(text(halsey)).toBe("Halsey");
    expect(text(latest?.querySelector(".scrobble__name"))).toBe("Pandora's Box");
    // album art when Last.fm has it, and a placeholder (not a broken image) when it doesn't
    expect(latest?.querySelector("img")?.getAttribute("src")).toBe(
      "https://lastfm.freetls.fastly.net/i/u/300x300/abc.jpg",
    );
    expect(played?.querySelector("img")).toBeNull();
    expect(played?.querySelector(".scrobble__art--none")).not.toBeNull();
    expect(played?.querySelector("time")?.getAttribute("datetime")).toBe(
      "2026-11-01T11:42:00.000Z",
    );
    // recently played comes first
    expect([...(section?.querySelectorAll(".listening__label") ?? [])].map(text)).toEqual([
      "Recently played",
      "Recent top artists",
    ]);
  });

  applicationTest("reads shows my shelves from Goodreads", async ({ element }) => {
    await visit("/reads");

    expect(document.title).toBe("Reads · Jordan Hawker");
    expect(text(element.querySelector(".reads-stats"))).toContain("337");
    expect(text(element.querySelector(".reads-stats"))).toContain("Science fiction");
    expect(text(element.querySelector(".book--featured .book__title"))).toBe("All Hail Chaos");
    expect(text(element.querySelector(".book--featured .book__series"))).toBe("Time of Iron #2");

    expect(text(element.querySelector("[aria-labelledby=reads-recent] .eyebrow"))).toBe("finished");

    const [noble] = element.querySelectorAll("[aria-labelledby=reads-recent] .book");

    expect(noble?.querySelector(".book__title a")?.getAttribute("href")).toBe(
      "https://www.goodreads.com/book/show/r1",
    );
    expect(noble?.querySelectorAll(".book__star--on")).toHaveLength(2);
    expect(text(noble?.querySelector(".book__review"))).toContain("something more exciting");

    // most-read entries mark books I own but haven't read
    const [dresden, redwall] = element.querySelectorAll(".reads-groups:last-child li");

    expect(text(dresden)).toBe("The Dresden Files 1 on my shelf 21 books");
    // authors link to Goodreads; series can't (the widget doesn't give their ids)
    expect(dresden?.querySelector("a")).toBeNull();
    expect(element.querySelector(".reads-groups:first-child li a")?.getAttribute("href")).toBe(
      "https://www.goodreads.com/author/show/10746",
    );
    expect(text(redwall)).toBe("Redwall 17 books");
    expect(text(element.querySelector(".reads-next__group"))).toContain("Mirror Mirror");
    expect(text(element.querySelector("[aria-labelledby=reads-next] .reads-intro"))).toBe(
      "Books I own from series and authors I’ve already enjoyed.",
    );
    // the Goodreads button sits in the stats card, beside what I'm reading
    expect(
      element.querySelector(
        '.reading-now .reads-stats a.button[href="https://www.goodreads.com/axlehellfire"]',
      ),
    ).not.toBeNull();
    expect(text(element.querySelector(".page-header p:not(.eyebrow)"))).toBe(
      "What I’m reading, the books I’ve loved, and what’s waiting to be read.",
    );
    expect(element.querySelector(".current-reads--carousel")).toBeNull();
  });

  applicationTest("votes shows the latest guide with its ballot outline", async ({ element }) => {
    await visit("/votes");
    await waitUntil(() => currentURL() === "/votes/2026");

    expect(text(element.querySelector(".vote-guide__title"))).toBe(
      "2026 Progressive Voter Guide - Nov General",
    );
    expect(element.querySelector<HTMLSelectElement>("#votes-election")?.value).toBe("2026");
    expect(text(element.querySelector(".votes__outline li"))).toBe(
      "Proposition 1: Affordable Housing yes",
    );
    expect(element.querySelector(".vote-guide .notice")).toBeNull();
    expect(document.title).toBe("Votes · Jordan Hawker");
  });

  applicationTest(
    "the election dropdown switches to a past guide and back",
    async ({ element }) => {
      await visit("/votes");

      await fillIn("#votes-election", "2024/primary");
      await waitUntil(() => currentURL() === "/votes/2024/primary");

      expect(text(element.querySelector(".vote-guide__title"))).toBe(
        "2024 Progressive Voter Guide - Mar Primary",
      );
      expect(text(element.querySelector(".vote-guide .notice"))).toContain("from a past election");
      expect(document.title).toBe("March 2024 Primary · Votes · Jordan Hawker");

      await fillIn("#votes-election", "2026");
      await waitUntil(() => currentURL() === "/votes/2026");
    },
  );

  applicationTest("links between guides stay on the site", async () => {
    await visit("/votes");
    await click('.vote-guide__body a[href="/votes/2024/primary"]');
    await waitUntil(() => currentURL() === "/votes/2024/primary");

    expect(currentURL()).toBe("/votes/2024/primary");
  });

  applicationTest("a general election lives at just the year", async ({ element }) => {
    await visit("/votes/2026/general");

    expect(currentURL()).toBe("/votes/2026");
    expect(text(element.querySelector(".vote-guide__title"))).toBe(
      "2026 Progressive Voter Guide - Nov General",
    );
  });

  applicationTest("unknown posts and pages say so", async ({ element }) => {
    await visit("/words/nope");

    expect(text(element.querySelector("h1"))).toBe("Post not found");

    await visit("/votes/1999-november-general");

    expect(text(element.querySelector(".notice"))).toContain("couldn’t find that guide");

    await visit("/somewhere/else");

    expect(text(element.querySelector("h1"))).toBe("Nothing here.");
  });
});

describe("when a source is down", () => {
  // vitest fixtures must destructure their context argument
  // eslint-disable-next-line no-empty-pattern
  applicationTest.override({ app: ({}, use) => use(App) });

  beforeEach(() => fakeApi({ failing: ["/api/resume", "bluesky", "/api/listening"] }));
  afterEach(() => resetApi());

  applicationTest("pages degrade to helpful notices", async ({ element }) => {
    await visit("/works");

    expect(text(element.querySelector(".notice"))).toContain("read it on Google Docs");

    await visit("/words");

    expect(text(element.querySelector(".bluesky .notice"))).toContain("see posts on bsky.app");
  });

  applicationTest("missing listening data doesn't name its source", async ({ element }) => {
    for (const [url, section] of [
      ["/", "[aria-labelledby=home-listening]"],
      ["/sound", "[aria-labelledby=listening]"],
    ] as const) {
      await visit(url);

      const notice = element.querySelector(`${section} .notice`);

      expect(text(notice), url).toBe("My listening history isn’t loading right now.");
    }
  });
});
