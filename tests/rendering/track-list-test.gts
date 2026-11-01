import { click, render } from "@ember/test-helpers";
import { afterEach, describe, expect } from "vitest";
import { renderingTest } from "ember-vitest";

import TrackList from "#components/sound/track-list.gts";
import { accentHex } from "#utils/color.ts";

import type { Track } from "#shared/api.ts";

import "#app/styles/tokens.css";
import "#app/styles/holidays.css";

const tracks: Track[] = [
  {
    id: "123",
    title: "Panorama",
    url: "https://soundcloud.com/axlehellfire/panorama",
    publishedAt: "2026-01-01",
  },
];

const playerColor = () =>
  new URL(document.querySelector<HTMLIFrameElement>(".track__player")!.src).searchParams.get(
    "color",
  );

describe("track list", () => {
  afterEach(() => {
    delete document.documentElement.dataset.holiday;
  });

  renderingTest("SoundCloud's player takes the theme's accent color", async () => {
    document.documentElement.dataset.holiday = "pride";
    await render(<template><TrackList @tracks={{tracks}} /></template>);

    await click(".track__play");

    expect(playerColor()).toBe(accentHex());
    expect(playerColor()).not.toBe("#d9532b");
  });
});
