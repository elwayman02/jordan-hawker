import { afterEach, describe, expect, test, vi } from "vitest";

import type { ListenedTrack } from "../shared/api.ts";
import {
  getListening,
  parseTags,
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
      { name: "Bruno Mars", url: "https://www.last.fm/music/Bruno+Mars", plays: 2, tags: [] },
      { name: "Emancipator", url: "https://www.last.fm/music/Emancipator", plays: 1, tags: [] },
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

describe("parseTags", () => {
  const tag = (name: string, count: number) => ({ name, count });

  test("keeps the strongest styles, leaving out tags about listeners, places and the artist", () => {
    expect(
      parseTags(
        {
          toptags: {
            tag: [
              tag("electronic", 100),
              tag("seen live", 90),
              tag("Flume", 80),
              tag("australian", 70),
              tag("Future Bass", 60),
              tag("electronic ", 50),
              tag("chillwave", 40),
              tag("ambient", 30),
            ],
          },
        },
        "Flume",
      ),
    ).toEqual(["electronic", "future bass", "chillwave"]);
  });

  test("ignores tags few listeners agree on", () => {
    expect(
      parseTags({ toptags: { tag: [tag("indie pop", 100), tag("dance", 9)] } }, "Lido"),
    ).toEqual(["indie pop"]);
  });

  test("handles a single tag (an object, not a list) and none at all", () => {
    expect(parseTags({ toptags: { tag: tag("soul", 100) } }, "Kim Massie")).toEqual(["soul"]);
    expect(parseTags({}, "Nobody")).toEqual([]);
  });
});

describe("getListening", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  test("fetches my last 200 plays, then each top artist's tags", async () => {
    vi.stubEnv("LASTFM_API_KEY", "secret");

    const track = Array.from({ length: 200 }, (_, n) =>
      scrobble(`Song ${n}`, `Artist ${n % 3}`, n + 1),
    );

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        const params = new URL(url).searchParams;
        const body =
          params.get("method") === "artist.gettoptags"
            ? { toptags: { tag: [{ name: `${params.get("artist")} style`, count: 100 }] } }
            : { recenttracks: { track } };

        return Promise.resolve(new Response(JSON.stringify(body)));
      }),
    );

    const listening = await getListening();
    const [recent, ...tags] = vi
      .mocked(fetch)
      .mock.calls.map(([url]) => new URL(url as string).searchParams);

    expect(recent?.get("method")).toBe("user.getrecenttracks");
    expect(recent?.get("user")).toBe("elwayman02");
    expect(recent?.get("limit")).toBe("200");
    expect(tags.map((params) => params.get("artist"))).toEqual([
      "Artist 0",
      "Artist 1",
      "Artist 2",
    ]);
    expect(listening.recent).toHaveLength(20);
    expect(listening.topArtists.map((artist) => [artist.name, artist.tags])).toEqual([
      ["Artist 0", ["artist 0 style"]],
      ["Artist 1", ["artist 1 style"]],
      ["Artist 2", ["artist 2 style"]],
    ]);
  });

  test("artists named with typographic hyphens are matched to Last.fm's plain-hyphen page", async () => {
    vi.stubEnv("LASTFM_API_KEY", "secret");
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        const params = new URL(url).searchParams;

        if (params.get("method") === "artist.gettoptags") {
          // only the plain-hyphen artist has tags on Last.fm
          const tags = params.get("artist") === "T-Pain" ? [{ name: "hip-hop", count: 100 }] : [];

          return Promise.resolve(new Response(JSON.stringify({ toptags: { tag: tags } })));
        }

        return Promise.resolve(
          new Response(
            JSON.stringify({
              recenttracks: {
                track: [
                  // U+2010, as some scrobblers write it
                  scrobble("Buy U a Drank", "T\u2010Pain", 1),
                  scrobble("Bartender", "T-Pain", 2),
                  scrobble("Dodo", "Emancipator", 3),
                ],
              },
            }),
          ),
        );
      }),
    );

    const listening = await getListening();

    expect(listening.topArtists).toEqual([
      { name: "T-Pain", url: "https://www.last.fm/music/T-Pain", plays: 2, tags: ["hip-hop"] },
      { name: "Emancipator", url: "https://www.last.fm/music/Emancipator", plays: 1, tags: [] },
    ]);
    expect(listening.recent.map((song) => song.artist)).toEqual([
      "T-Pain",
      "T-Pain",
      "Emancipator",
    ]);
  });

  test("an artist whose tags fail to load is still listed, without tags", async () => {
    vi.stubEnv("LASTFM_API_KEY", "secret");
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        const params = new URL(url).searchParams;

        if (params.get("method") === "artist.gettoptags") {
          return Promise.resolve(
            params.get("artist") === "Lido"
              ? new Response("{}", { status: 500 })
              : new Response(JSON.stringify({ toptags: { tag: [{ name: "idm", count: 100 }] } })),
          );
        }

        return Promise.resolve(
          new Response(
            JSON.stringify({
              recenttracks: { track: [scrobble("A", "Lido", 1), scrobble("B", "Bonobo", 2)] },
            }),
          ),
        );
      }),
    );

    const listening = await getListening();

    expect(listening.topArtists.map((artist) => [artist.name, artist.tags])).toEqual([
      ["Lido", []],
      ["Bonobo", ["idm"]],
    ]);
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
