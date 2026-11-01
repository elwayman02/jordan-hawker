import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

import { END, metaFor, renderMeta, SITE_META, START, withMeta } from "./meta.ts";

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const tag = (html: string, pattern: RegExp) => pattern.exec(html)?.[1];

describe("link previews", () => {
  test("each section has its own", () => {
    const titles = ["/works", "/codes", "/sound", "/words", "/votes"].map(
      (path) => metaFor(path).title,
    );

    expect(titles).toEqual([
      "Works · Jordan Hawker",
      "Codes · Jordan Hawker",
      "Sound · Jordan Hawker",
      "Words · Jordan Hawker",
      "Votes · Jordan Hawker",
    ]);
    expect(
      new Set(
        ["/works", "/codes", "/sound", "/words", "/votes"].map((path) => metaFor(path).description),
      ).size,
    ).toBe(5);
  });

  test("the home page, and anything unknown, get the site's", () => {
    expect(metaFor("/")).toBe(SITE_META);
    expect(metaFor("/nope")).toBe(SITE_META);
  });

  test("voter guides say their year and election, from the address alone", () => {
    expect(metaFor("/votes/2024").title).toBe("2024 General Election Voter Guide · Jordan Hawker");
    expect(metaFor("/votes/2024/primary").title).toBe(
      "2024 Primary Election Voter Guide · Jordan Hawker",
    );
    expect(metaFor("/votes/2026/special").title).toBe(
      "2026 Special Election Voter Guide · Jordan Hawker",
    );
    expect(metaFor("/votes/2024/primary").description).toContain("2024 primary election");
  });

  test("anything else under /votes gets the Votes preview", () => {
    for (const path of [
      "/votes/hello",
      "/votes/1850",
      "/votes/2024/runoff",
      "/votes/2024/primary/x",
    ]) {
      expect(metaFor(path), path).toBe(metaFor("/votes"));
    }
  });

  test("posts share the Words preview; trailing slashes don't matter", () => {
    expect(metaFor("/words/some-post")).toBe(metaFor("/words"));
    expect(metaFor("/works/")).toBe(metaFor("/works"));
  });

  test("are written into index.html", () => {
    const html = withMeta(indexHtml, new URL("https://www.jordanhawker.com/votes/2024/primary/"));

    expect(tag(html, /<title>(.*?)<\/title>/)).toBe(
      "2024 Primary Election Voter Guide · Jordan Hawker",
    );
    expect(tag(html, /property="og:title" content="(.*?)"/)).toBe(
      "2024 Primary Election Voter Guide · Jordan Hawker",
    );
    expect(tag(html, /property="og:url" content="(.*?)"/)).toBe(
      "https://www.jordanhawker.com/votes/2024/primary",
    );
    expect(tag(html, /name="description" content="(.*?)"/)).toBe(
      metaFor("/votes/2024/primary").description,
    );
    // once each: the defaults are replaced, not added to
    expect(html.match(/<title>/g)).toHaveLength(1);
    expect(html.match(/og:description/g)).toHaveLength(1);
    // the rest of the page is untouched
    expect(html.slice(html.indexOf(END))).toBe(indexHtml.slice(indexHtml.indexOf(END)));
  });

  test("index.html's defaults are the home page's (what local dev shows)", () => {
    expect(indexHtml).toContain(START);
    expect(tag(indexHtml, /<title>(.*?)<\/title>/)).toBe(SITE_META.title);
    expect(tag(indexHtml, /name="description"\s+content="([^"]*)"/)).toBe(SITE_META.description);
    expect(tag(indexHtml, /property="og:description"\s+content="([^"]*)"/)).toBe(
      SITE_META.description,
    );
    expect(tag(indexHtml, /property="og:image" content="([^"]*)"/)).toBe(
      "https://www.jordanhawker.com/og/home.png",
    );
  });

  test("each section has its own image; guides use Votes', posts Words'", () => {
    const image = (path: string) =>
      tag(
        withMeta(indexHtml, new URL(`https://www.jordanhawker.com${path}`)),
        /og:image" content="([^"]*)"/,
      );

    expect(image("/")).toBe("https://www.jordanhawker.com/og/home.png");
    expect(image("/works")).toBe("https://www.jordanhawker.com/og/works.png");
    expect(image("/votes/2024/primary")).toBe("https://www.jordanhawker.com/og/votes.png");
    expect(image("/words/some-post")).toBe("https://www.jordanhawker.com/og/words.png");
    expect(image("/nope")).toBe("https://www.jordanhawker.com/og/home.png");
  });

  test("images come from wherever the page is served (a deploy preview has them first)", () => {
    const html = withMeta(
      indexHtml,
      new URL("https://deploy-preview-12--jordanhawker.netlify.app/works"),
    );

    expect(tag(html, /og:image" content="([^"]*)"/)).toBe(
      "https://deploy-preview-12--jordanhawker.netlify.app/og/works.png",
    );
    // the link itself is still the real address
    expect(tag(html, /og:url" content="([^"]*)"/)).toBe("https://www.jordanhawker.com/works");
  });

  test("every card image exists, at 1200×630", () => {
    const paths = ["/", "/works", "/codes", "/sound", "/words", "/votes", "/votes/2024"];

    for (const image of new Set(paths.map((path) => metaFor(path).image))) {
      const png = readFileSync(new URL(`../public/og/${image}.png`, import.meta.url));

      // a PNG's width and height sit at bytes 16–23
      expect([png.readUInt32BE(16), png.readUInt32BE(20)], image).toEqual([1200, 630]);
    }
  });

  test("leaves HTML without the markers alone, and escapes what it writes", () => {
    expect(withMeta("<p>hi</p>", new URL("https://x.test/works"))).toBe("<p>hi</p>");

    const html = renderMeta(
      { title: 'Say "hi" <b>', description: "A & B", image: "home" },
      "https://x.test/",
    );

    expect(html).toContain("Say &quot;hi&quot; &lt;b&gt;");
    expect(html).toContain("A &amp; B");
    expect(html).not.toContain("<b>");
  });
});
