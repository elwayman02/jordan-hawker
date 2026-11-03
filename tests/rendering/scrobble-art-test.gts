import { render, waitUntil } from "@ember/test-helpers";
import { describe, expect } from "vitest";
import { renderingTest } from "ember-vitest";

import ScrobbleArt from "#components/sound/scrobble-art.gts";

/** A 1×1 transparent PNG */
const WORKS =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
/** Image data that can't be decoded, like art Last.fm lists but won't serve */
const BROKEN = "data:image/png;base64,bm90IGFuIGltYWdl";

describe("<ScrobbleArt>", () => {
  renderingTest("shows the album art when it loads", async ({ element }) => {
    await render(<template><ScrobbleArt @src={{WORKS}} /></template>);

    const image = element.querySelector<HTMLImageElement>("img.scrobble__art");

    await waitUntil(() => image?.complete);

    expect(image?.naturalWidth).toBe(1);
    expect(element.querySelector("img.scrobble__art")).toBe(image);
  });

  renderingTest("falls back to the placeholder when the art won't load", async ({ element }) => {
    await render(<template><ScrobbleArt @src={{BROKEN}} /></template>);

    await waitUntil(() => element.querySelector(".scrobble__art--none"));

    expect(element.querySelector("img")).toBeNull();
  });

  renderingTest("shows the placeholder when there's no art", async ({ element }) => {
    await render(<template><ScrobbleArt /></template>);

    expect(element.querySelector(".scrobble__art--none")).not.toBeNull();
  });
});
