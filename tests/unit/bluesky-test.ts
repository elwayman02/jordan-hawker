import { describe, expect, test } from "vitest";

import { splitFacets } from "#utils/bluesky.ts";

describe("splitFacets", () => {
  test("links facets using UTF-8 byte offsets", () => {
    // "🍄 " is 5 bytes, so the link starts at byte 5
    const text = "🍄 see example.com now";
    const facets = [
      {
        index: { byteStart: 9, byteEnd: 20 },
        features: [{ $type: "app.bsky.richtext.facet#link", uri: "https://example.com" }],
      },
    ];

    expect(splitFacets(text, facets)).toEqual([
      { text: "🍄 see " },
      { text: "example.com", href: "https://example.com" },
      { text: " now" },
    ]);
  });

  test("returns the whole text when there are no facets", () => {
    expect(splitFacets("plain")).toEqual([{ text: "plain" }]);
  });
});
