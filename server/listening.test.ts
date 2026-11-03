import { afterEach, describe, expect, test, vi } from "vitest";

import type { ListenedTrack } from "../shared/api.ts";
import {
  getListening,
  parsePlays,
  recentSongs,
  topArtists,
  type RecentTracksResponse,
} from "./listening.ts";

const NOW = Date.parse("2026-11-03T12:00:00Z");
const HOUR = 60 * 60 * 1000;

const art = (hash: string) =>
  (["small", "medium", "large", "extralarge"] as const).map((size) => ({
    size,
    "#text": `https://lastfm.freetls.fastly.net/i/u/${size === "extralarge" ? "300x300" : "64s"}/${hash}.jpg`,
  }));

/** A scrobble shaped like Last.fm's, played `hoursAgo` before NOW */
const scrobble = (name: string, artist: string, hoursAgo: number) => ({
  name,
  url: `https://www.last.fm/music/${artist}/_/${name}`,
  artist: { "#text": artist },
  date: { uts: String((NOW - hoursAgo * HOUR) / 1000) },
});

/** A play as the parser returns it */
const play = (name: string, artist: string, hoursAgo: number): ListenedTrack => ({
  name,
  artist,
  url: `https://www.last.fm/music/${artist}/_/${name}`,
  playedAt: new Date(NOW - hoursAgo * HOUR).toISOString(),
});

describe("parsePlays", () => {
  const response: RecentTracksResponse = {
    recenttracks: {
      track: [
        {
          ...scrobble("Pandora's Box", "Beats Antique", 0),
          date: undefined,
          "@attr": { nowplaying: "true" },
        },
        {
          ...scrobble("Collide", "Beats Antique", 1),
          album: { "#text": "Collide" },
          image: art("abc"),
        },
        // Last.fm's placeholder when there's no art
        {
          ...scrobble("Left Alone", "Flume", 2),
          album: { "#text": "" },
          image: art("2a96cbd8b46e442fc41c2b86b821562f"),
        },
      ],
    },
  };

  test("leaves out what's playing now, and takes the largest real album art", () => {
    expect(parsePlays(response)).toEqual([
      {
        name: "Collide",
        artist: "Beats Antique",
        album: "Collide",
        url: "https://www.last.fm/music/Beats Antique/_/Collide",
        image: "https://lastfm.freetls.fastly.net/i/u/300x300/abc.jpg",
        playedAt: "2026-11-03T11:00:00.000Z",
      },
      {
        name: "Left Alone",
        artist: "Flume",
        url: "https://www.last.fm/music/Flume/_/Left Alone",
        playedAt: "2026-11-03T10:00:00.000Z",
      },
    ]);
  });

  test("handles a single track (an object, not a list) and none at all", () => {
    expect(parsePlays({ recenttracks: { track: scrobble("Rest", "Bruno Mars", 1) } })).toHaveLength(
      1,
    );
    expect(parsePlays({ recenttracks: {} })).toEqual([]);
  });
});

describe("recentSongs", () => {
  test("each song shows once, at its most recent play", () => {
    const plays = [
      // the scrobbling bug: one play logged over and over
      ...Array.from({ length: 30 }, (_, n) => play("Rest", "Bruno Mars", n / 60)),
      play("Dodo", "Emancipator", 1),
      play("rest ", "bruno  mars", 2),
      play("Rest", "Someone Else", 3),
    ];

    expect(recentSongs(plays).map((song) => [song.name, song.artist])).toEqual([
      ["Rest", "Bruno Mars"],
      ["Dodo", "Emancipator"],
      // same title, different artist: a different song
      ["Rest", "Someone Else"],
    ]);
  });

  test("counts the limit after repeats are removed", () => {
    const plays = [
      ...Array.from({ length: 40 }, (_, n) => play("Rest", "Bruno Mars", n / 60)),
      ...Array.from({ length: 5 }, (_, n) => play(`Song ${n}`, "Lido", 1 + n)),
    ];

    expect(recentSongs(plays, 3).map((song) => song.name)).toEqual(["Rest", "Song 0", "Song 1"]);
  });
});

describe("topArtists", () => {
  test("a song repeated back to back counts once; played again later, it counts again", () => {
    const plays = [
      ...Array.from({ length: 30 }, (_, n) => play("Rest", "Bruno Mars", n / 60)),
      play("Dodo", "Emancipator", 1),
      play("Rest", "Bruno Mars", 2),
      play("Rest", "Bruno Mars", 2.01),
    ];

    expect(topArtists(plays)).toEqual([
      { name: "Bruno Mars", url: "https://www.last.fm/music/Bruno+Mars", plays: 2 },
      { name: "Emancipator", url: "https://www.last.fm/music/Emancipator", plays: 1 },
    ]);
  });

  test("most played first, ties to the most recently played", () => {
    const plays = [
      play("A", "Lido", 1),
      play("B", "Flume", 2),
      play("C", "Flume", 3),
      play("D", "Bonobo", 4),
      play("E", "Lido", 5),
    ];

    expect(topArtists(plays).map((artist) => [artist.name, artist.plays])).toEqual([
      ["Lido", 2],
      ["Flume", 2],
      ["Bonobo", 1],
    ]);
  });
});

describe("getListening", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  test("makes one request for my last 200 plays, for both lists", async () => {
    vi.stubEnv("LASTFM_API_KEY", "secret");

    const track = Array.from({ length: 200 }, (_, n) =>
      scrobble(`Song ${n}`, `Artist ${n % 3}`, n + 1),
    );

    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response(JSON.stringify({ recenttracks: { track } })))),
    );

    const listening = await getListening();
    const calls = vi.mocked(fetch).mock.calls.map(([url]) => new URL(url as string).searchParams);

    expect(calls).toHaveLength(1);
    expect(calls[0]?.get("method")).toBe("user.getrecenttracks");
    expect(calls[0]?.get("user")).toBe("elwayman02");
    expect(calls[0]?.get("limit")).toBe("200");
    expect(listening.recent).toHaveLength(20);
    expect(listening.topArtists.map((artist) => artist.plays)).toEqual([67, 67, 66]);
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
