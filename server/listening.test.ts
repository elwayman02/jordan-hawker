import { afterEach, describe, expect, test, vi } from "vitest";

import {
  getListening,
  parseRecentTracks,
  parseTopArtists,
  type RecentTracksResponse,
  type TopArtistsResponse,
} from "./listening.ts";

const art = (hash: string) =>
  (["small", "medium", "large", "extralarge"] as const).map((size) => ({
    size,
    "#text": `https://lastfm.freetls.fastly.net/i/u/${size === "extralarge" ? "300x300" : "64s"}/${hash}.jpg`,
  }));

// shaped like Last.fm's user.getrecenttracks JSON
const recent: RecentTracksResponse = {
  recenttracks: {
    track: [
      {
        name: "Pandora's Box",
        url: "https://www.last.fm/music/Beats+Antique/_/Pandora%27s+Box",
        artist: { "#text": "Beats Antique" },
        album: { "#text": "Collide" },
        image: art("abc"),
        "@attr": { nowplaying: "true" },
      },
      {
        name: "Left Alone (feat. Chet Faker)",
        url: "https://www.last.fm/music/Flume/_/Left+Alone",
        artist: { "#text": "Flume" },
        album: { "#text": "" },
        // Last.fm's placeholder when there's no art
        image: art("2a96cbd8b46e442fc41c2b86b821562f"),
        date: { uts: "1761997320" },
      },
    ],
  },
};

const top: TopArtistsResponse = {
  topartists: {
    artist: [
      { name: "T-Pain", url: "https://www.last.fm/music/T-Pain", playcount: "142" },
      { name: "Halsey", url: "https://www.last.fm/music/Halsey", playcount: "97" },
    ],
  },
};

describe("parseRecentTracks", () => {
  test("marks what's playing now, and takes the largest real album art", () => {
    expect(parseRecentTracks(recent)).toEqual([
      {
        name: "Pandora's Box",
        artist: "Beats Antique",
        album: "Collide",
        url: "https://www.last.fm/music/Beats+Antique/_/Pandora%27s+Box",
        image: "https://lastfm.freetls.fastly.net/i/u/300x300/abc.jpg",
        nowPlaying: true,
      },
      {
        name: "Left Alone (feat. Chet Faker)",
        artist: "Flume",
        url: "https://www.last.fm/music/Flume/_/Left+Alone",
        playedAt: "2025-11-01T11:42:00.000Z",
        nowPlaying: false,
      },
    ]);
  });

  test("handles a single track (an object, not a list) and none at all", () => {
    const [first] = (recent.recenttracks.track as never[]) ?? [];

    expect(parseRecentTracks({ recenttracks: { track: first } })).toHaveLength(1);
    expect(parseRecentTracks({ recenttracks: {} })).toEqual([]);
  });

  test("keeps to the limit, even with a track playing on top of it", () => {
    expect(parseRecentTracks(recent, 1).map((track) => track.name)).toEqual(["Pandora's Box"]);
  });
});

describe("parseTopArtists", () => {
  test("reads names, links and play counts", () => {
    expect(parseTopArtists(top)).toEqual([
      { name: "T-Pain", url: "https://www.last.fm/music/T-Pain", plays: 142 },
      { name: "Halsey", url: "https://www.last.fm/music/Halsey", plays: 97 },
    ]);
  });
});

describe("getListening", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  test("asks Last.fm for my recent tracks and last month's top artists", async () => {
    vi.stubEnv("LASTFM_API_KEY", "secret");
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) =>
        Promise.resolve(
          new Response(JSON.stringify(url.includes("getrecenttracks") ? recent : top)),
        ),
      ),
    );

    const listening = await getListening();
    const urls = vi.mocked(fetch).mock.calls.map(([url]) => new URL(url as string));

    expect(listening.recent).toHaveLength(2);
    expect(listening.topArtists[0]?.name).toBe("T-Pain");
    expect(urls.map((url) => url.searchParams.get("user"))).toEqual(["elwayman02", "elwayman02"]);
    expect(urls[1]?.searchParams.get("period")).toBe("1month");
  });

  test("fails without a key, so the last good snapshot is served", async () => {
    vi.stubEnv("LASTFM_API_KEY", "");

    await expect(getListening()).rejects.toThrow("LASTFM_API_KEY is not set");
  });

  test("keeps the key out of error messages (they end up in logs)", async () => {
    vi.stubEnv("LASTFM_API_KEY", "secret");
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(new Response('{"error":10,"message":"Invalid API key"}', { status: 403 })),
      ),
    );

    const error = await getListening().then(
      () => undefined,
      (caught: unknown) => caught as Error,
    );

    expect(error?.message).toContain("403");
    expect(error?.message).not.toContain("secret");
  });
});
